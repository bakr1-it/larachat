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

}
