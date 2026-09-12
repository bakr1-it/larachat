<?php

namespace Database\Seeders;

use App\Models\Conversation;
use App\Models\Group;
use App\Models\User;
use App\Models\Message;
use Database\Factories\GroupFactory;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;


class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
User::create([
            'name' =>"bakr",
            'email' => "bakr.it.dev@gmail.com",
            "is_admin"=>true,
            'email_verified_at' => now(),
            'password' =>  Hash::make('123456789'),
            'remember_token' => Str::random(10),
]);
User::create([
            'name' =>"saad",
            'email' => "saad.ai.py@gmail.com",
            'email_verified_at' => now(),
            'password' =>  Hash::make('123456789'),
            'remember_token' => Str::random(10),
]);


        User::factory(10)->create();
for($i=0 ; $i<=5 ; $i++){
    $group = Group::factory()->create([
        "owner_id"=>1,
    ]);
    $user= User::inRandomOrder()->limit(rand(2,5))->pluck("id");
    $group->users()->attach(array_unique([1,...$user]));

}
Message::factory(1000)->create();
$conversation = Message::whereNull("group_id")->orderBy("created_at")->get();

$conversation= $conversation->groupBy(fn($message)=>collect([$message->sender_id,$message->receiver_id])->sort()->implode("_"))
->map(fn($conversationTocreate)=>
[
    "sender_id"=>$conversationTocreate->first()->sender_id ,
    "receiver_id"=>$conversationTocreate->first()->receiver_id  ,
    "last_message_id"=> $conversationTocreate->last()->id ,
    "created_at"=>now(),
    "updated_at"=>now()

    ]
)->values();
Conversation::insertOrIgnore($conversation->toArray());



}

    }
