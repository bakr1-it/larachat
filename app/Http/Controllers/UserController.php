<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

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
$data["password"] = "12345678";
$data["email_verified_at"]=now();

$user= User::create($data);
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
    return response()->json(["message"=>$message]);

    }
    public function changeRoleUser(User $user){
        $user->is_admin = !$user->is_admin;
        $user->save();
        return response()->json(["message"=>"user chagne role is success"]);

    }

}
