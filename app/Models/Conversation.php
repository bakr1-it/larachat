<?php

namespace App\Models;

use App\Http\Resources\userResource;
use Illuminate\Database\Eloquent\Model;

class Conversation extends Model
{
    protected $fillable = [
        'sender_id',
        'receiver_id',
        'last_message_id',
    ];
    public function sender(){
    return $this->belongsTo(User::class , "sender_id");
}
public function lastMessage(){
    return $this->belongsTo(Message::class , "last_message_id");
}
public function receiver(){
    return $this->belongsTo(User::class , "receiver_id");
}

public static function getConversationForSidebar(User $user){
$users= User::getUserExceptCurrentUser($user);
$groups =Group::getGroupForCurrentUser($user);
return $users->map(function ($user){
    return $user->toConversationArray();
})->concat($groups->map(function ($group){
return $group->toConversationArray();
}));
}
public static function updateConversationLastMessage( int $receiverId ,int  $snederId ,Message $message){
$conversation = Conversation::where(function ($q) use ($receiverId , $snederId){
    $q->where("sender_id",$snederId)->where("receiver_id",$receiverId);
    })->orWhere(function ($q) use ($receiverId , $snederId){
    $q->where("receiver_id",$snederId)->where("sender_id",$receiverId);

})->first();
if($conversation){
    $conversation->update(["last_message_id"=>$message->id]);
}else{
    Conversation::create(["receiver_id"=>$receiverId , "sender_id" => $snederId , "last_message_id"=>$message->id] );
}



}
}
