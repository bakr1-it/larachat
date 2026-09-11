<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    protected $fillable = [
        'body',
        'sender_id',
        'recevier_id',
        'conversation_id',
        'group_id',
    ];

public function sender(){
    return $this->belongsTo(User::class , "sender_id");
}
public function receiver(){
    return $this->belongsTo(User::class , "receiver_id");
}
public function group(){
    return $this->belongsTo(Group::class);
}
public function attachment(){
    return $this->hasMany(Message_attachment::class);
}

    }
