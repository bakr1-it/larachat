<?php

namespace App\Http\Controllers;

use App\Mail\UserBlockUnblockMail;
use App\Mail\UserChangeRoleMail;
use App\Mail\UserCreateMail;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class UserController extends Controller
{
    public function store(Request $request){
$data= $request->validate([
    "name"=>
    [
        "required",
        "string"
    ],
    "email"=>
    [
        "required",
        "unique:users,email",
        "email",
    ],
    "is_admin"=>
    [
        "nullable",
        "boolean"
    ]
]);
$password = Str::random(8);
$data["password"] =$password;
$data["email_verified_at"]=now();

$user= User::create($data);
Mail::to($user)->queue(new UserCreateMail($user, $password));
return  redirect()->back();

    }
    public function blockUnblock(string $id){
        $user= User::findorFail($id);

$message=null;
    if($user->blocked_at != null){
        $user->blocked_at=null;
        $message="This Acounnt is Unblock";

        }else{
            $user->blocked_at=now();
            $message="This Acounnt is block";
    }
     $user->save();

    Mail::to($user)->queue(new UserBlockUnblockMail($user));
    return response()->json(["message"=>$message]);

    }
    public function changeRoleUser(string $id){

        $user= User::findorFail($id);


        $is_admin=$user->is_admin ?"Ruglar user":"admin";
        $user->is_admin = !($user->is_admin);
        $user->save();
    Mail::to($user)->queue(new UserChangeRoleMail($user));
        return response()->json(["message"=>" change role name user is {$user->name} to {$is_admin}"]);

    }
}

