<?php

namespace App\Http\Controllers;

use App\Events\socketMessageEvent;
use App\Http\Requests\StoreMessageRequest;
use App\Http\Resources\MessageResource;
use App\Models\Conversation;
use App\Models\Group;
use App\Models\Message;
use App\Models\Message_attachment;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;



class MessageController extends Controller
{
    public function byUser(User  $user){
$message = Message::where("sender_id",Auth::id())
->where("receiver_id",$user->id)
->orwhere("sender_id",$user->id)
->where("receiver_id",Auth::id())
->latest()->paginate(10);
return Inertia("Home",[
    "selectedConversation"=>$user->toConversationArray(),
    "messages"=> MessageResource::collection($message)
]);

    }
    public function byGroup(Group $group){
        if($group->users()->where("users.id",Auth::id())->exists()){

            $message= Message::where("group_id",$group->id)
            ->latest()
            ->paginate(10);
            return Inertia("Home",[
                "selectedConversation"=>$group->toConversationArray(),
                "messages"=> MessageResource::collection($message)
                ]);
                }else{
                    return abort(403);
                }

    }
public function loadOlder(int $id)
{

    $message= Message::findOrFail($id);
    if($message->group_id ){
       $group=  Group::findOrFail($message->group_id);
       if(!$group->users()->where("users.id",Auth::id())->exists()){
           abort(403);

           }
           }else{
               if($message->sender_id !== Auth::id() &&  $message->receiver_id !== Auth::id() ){
         abort(403);

     }
    }
    $messageData =$message->group_id
     ? Message::where("group_id", "=", $message->group_id)
            ->where("created_at", "<", $message->created_at)
            ->latest()
            ->paginate(10)
      :
      Message::where("created_at", "<", $message->created_at)
            ->where(function ($query) use ($message) {
                $query->where(function ($q) use ($message) {
                    $q->where("sender_id", "=", $message->sender_id)
                      ->where("receiver_id", "=", $message->receiver_id);
                })->orWhere(function ($q) use ($message) {
                    $q->where("sender_id", "=", $message->receiver_id)
                      ->where("receiver_id", "=", $message->sender_id);
                });
            })
            ->latest()
            ->paginate(10);
       ;

    return MessageResource::collection($messageData);
}

public function store(StoreMessageRequest $store){
$authId= Auth::id();
$data=$store->validated();
$data["sender_id"] =$authId;
$receiverId= $data["receiver_id"]?? null;
$groupId= $data["group_id"] ?? null;
$files= $data["attachments"] ?? [];
$message = Message::create($data);
$attachments=[];
if($files){
    foreach($files as $file ){
        $dir= "attachment/". Str::random(32);
        Storage::makeDirectory($dir);
        $model = [
            "message_id"=>$message->id,
            "name"=>$file->getClientOriginalName(),
            "size"=>$file->getSize(),
            "mime"=>$file->getClientMimeType(),
            "path"=>$file->store($dir ,"public"),

        ];
        $attachment=Message_attachment::create($model);
        $attachments[]= $attachment;

    }
    $message->attachments = $attachments;

    }
        if($receiverId){
        Conversation::updateConversationLastMessage($receiverId ,$authId , $message);

    }if($groupId){
        Group::updateGroupLastMessage($groupId,$message);

    }

    socketMessageEvent::dispatch($message);
    return new MessageResource($message);

    }
    public function destroy(string $id){
        $message = Message::findOrFail($id);

        $prevMessage= null;
        $group=null;
        $conversation= null;

        if($message->sender_id !== Auth::id()){
            return response()->json(["error"=>"forbidden"],403);
        }
        if($message->group_id){
            $group = Group::where("last_message_id",$message->id)->first();


            }else{

$conversation = Conversation::where(function ($q) use ($message) {
        $q->where('sender_id', $message->sender_id)
          ->where('receiver_id', $message->receiver_id);
    })->orWhere(function ($q) use ($message) {
        $q->where('sender_id', $message->receiver_id)
          ->where('receiver_id', $message->sender_id);
    })->first();



        }
        // dd($message , $group,$conversation);




        $message->delete();
        if($message->group_id) {
if($group){
    $group->refresh();
    $prevMessage = $group->lastMessage ? new MessageResource($group->lastMessage): null;

}
}else{
if($conversation){

    $conversation->refresh();
    $prevMessage = $conversation->lastMessage ? new MessageResource($conversation->lastMessage): null;
    }
    }

        return response()->json(["message"=>"delete success","prevMessage"=> $prevMessage]);
    }
}



