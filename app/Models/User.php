<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Auth;

#[Fillable(['name', 'email', 'avatar', 'is_admin', 'blocked_at', 'email_verified_at', 'password'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;


    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
    public function groups(){
        return $this->belongsToMany(Group::class , "group_user" );
    }
public static function getUserExceptCurrentUser(User $user){
    $userId = $user->id;
    $query = User::select(["users.*", "messages.body as last_message", "messages.created_at as last_message_date"])
    ->where("users.id", "!=", $userId)
    ->when(!$user->is_admin, function ($query){
        return $query->whereNull("users.blocked_at");
    })
    ->leftJoin('conversations', function ($join) use ($userId) {
        $join->on(function ($query) use ($userId) {
            $query->whereColumn('conversations.sender_id', '=', 'users.id')
                  ->where('conversations.receiver_id', '=', $userId);
        })
        ->orOn(function ($query) use ($userId) {
            $query->where('conversations.sender_id', '=', $userId)
                  ->whereColumn('conversations.receiver_id', '=', 'users.id');
        });
    })
    ->leftJoin("messages", "messages.id", "=", "conversations.last_message_id")
    ->orderByRaw("IFNULL(users.blocked_at,1)")
    ->orderByDesc("messages.created_at")
    ->orderByDesc("users.name");

    return $query->get();
}
public function toConversationArray()
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'is_group' => false,
            'is_user' => true,
            'is_admin' => (bool) $this->is_admin,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'blocked_at' => $this->blocked_at,
            'last_message' => $this->last_message,
            'last_message_date' => $this->last_message_date,
        ];
    }
}
