<?php

namespace App\Observers;

use App\Models\Conversation;
use App\Models\Group;
use App\Models\Message;
use Illuminate\Support\Facades\Storage;

class MessageObserver
{
    /**
     * Handle the Message "created" event.
     */
    public function created(Message $message): void
    {
        //
    }

    /**
     * Handle the Message "updated" event.
     */
    public function updated(Message $message): void
    {
        //
    }

    /**
     * Handle the Message "deleted" event.
     */
    public function deleted(Message $message): void
    {
        //
    }

    /**
     * Handle the Message "restored" event.
     */
    public function restored(Message $message): void
    {
        //
    }

    /**
     * Handle the Message "force deleted" event.
     */
    public function forceDeleted(Message $message): void
    {
        //
    }
    public function deleting(Message $message){

            $message->attachment->each(function ($attachment){
                $dir= dirname($attachment->path);
                Storage::disk("public")->deleteDirectory($dir);

            });

$message->attachment()->delete();

if($message->group_id){
$group= Group::where("last_message_id", $message->id)->first();
if($group){
    $prevMessage= Message::where("group_id",$group->id)
    ->where("id","!=",$message->id)->latest()->first();
if($prevMessage){
    $group->last_message_id=$prevMessage->id;
    $group->save();
}
    }

}
else{
$conversation = Conversation::where("last_message_id",$message->id)->first();
if($conversation){
$prevMessage = Message::where(function ($q) use ($message){
    $q->where("sender_id",$message->sender_id)
    ->where("receiver_id",$message->receiver_id)
    ->orWhere("receiver_id",$message->sender_id)
    ->orWhere("sender_id",$message->receiver_id);
})
->where("id","!=",$message->id)->latest()->first();
}
if($prevMessage){
    $conversation->last_message_id= $prevMessage->id;
    $conversation->save();
}


}


    }

}
