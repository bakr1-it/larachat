<?php

use App\Models\User;
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('online', function ($user) {
    return $user;
});
Broadcast::channel("message.user.{sender_id}-{receiver_id}",fn(User $user , int $snederId , $receiverId)=> $user->id == $receiverId || $user->id == $snederId ?$user:null);
Broadcast::channel("group.user.{group_id}",fn(User $user , int $groupId) => $user->groups->contains("id",$groupId) ?$user:null );
