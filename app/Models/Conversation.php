<?php

namespace App\Models;

use App\Http\Resources\userResource;
use Illuminate\Database\Eloquent\Model;

class Conversation extends Model
{
    protected $fillable = [
        'sender_id',
        'recevier_id',
        'last_message_id',
    ];
    public function sender(){
    return $this->belongsTo(User::class , "sender_id");
}
public function receiver(){
    return $this->belongsTo(User::class , "receiver_id");
}
public function lastMessaeg(){
    return $this->belongsTo(Message::class,"last_message_id");
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
}
