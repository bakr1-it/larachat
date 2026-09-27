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
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;


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
        $message= Message::where("group_id",$group->id)
        ->latest()
        ->paginate(10);
        return Inertia("Home",[
    "selectedConversation"=>$group->toConversationArray(),
    "messages"=> MessageResource::collection($message)
]);

    }
public function loadOlder(int $id)
{
    $message= Message::findOrFail($id);
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
    $message->attachment = $attachments;

    }
        if($receiverId){
        Conversation::updateConversationLastMessage($receiverId ,$authId , $message);

    }if($groupId){
        Group::updateGroupLastMessage($groupId,$message);

    }

    socketMessageEvent::dispatch($message);
    return new MessageResource($message);

    }
    public function destory(Message $message){
        if($message->sneder_id !== Auth::id()){
            return response()->json(["error"=>"forbidden"],403);
        }
        $message->delete();
        return response()->json(["message"=>"delete success"],204);
    }
}



