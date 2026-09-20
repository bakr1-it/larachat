<?php
use App\Http\Resources\userResource;
use App\Models\User;
use Illuminate\Support\Facades\Broadcast;


Broadcast::channel("message.user.{sender_id}-{receiver_id}",fn(User $user , int $sender_id , int $receiver_id)=> $user->id == $sender_id || $user->id == $receiver_id);
Broadcast::channel("online",fn(User $user)=> $user ? new userResource($user): null);
Broadcast::channel("message.group.{group_id}",fn(User $user , int $groupId  )=>  $user->groups->contains("id",$groupId) );
