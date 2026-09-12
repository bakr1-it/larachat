<?php

namespace Database\Factories;

use App\Models\Message;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Message>
 */
class MessageFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array

    {
        $senderId=null;
        $receiverId=null;
        $groupId=null;
        $senderId= $this->faker->randomElement(\App\Models\User::pluck("id")->toArray());
        $receiverId=$this->faker->randomElement(\App\Models\User::where("id","!=",$senderId)->pluck("id")->toArray());

if($this->faker->boolean(50)){

$groupId= $this->faker->randomElement(\App\Models\Group::pluck("id")->toArray());
$groupId= \App\Models\Group::findOrFail($groupId);
$senderId= $this->faker->randomElement($groupId->users()->pluck("users.id")->toArray());
$receiverId=null;
}


        return [
            "receiver_id"=>$receiverId,
            "sender_id"=>$senderId,
            "group_id"=>$groupId,
            "body"=>$this->faker->text,
            "created_at"=>$this->faker->dateTimeBetween("-1 year",now())        ];
    }
}
