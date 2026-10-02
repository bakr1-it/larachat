<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\ProfileController;
use App\Models\User;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::middleware(["auth"])
->group(function (){
Route::get("/home",[HomeController::class , "home"])->name("dashboard");
Route::get("/user/{user}",[MessageController::class, "byUser"])->name("chat.user");
Route::get("/group/{group}",[MessageController::class, "byGroup"])->name("chat.group");
Route::post("/message",[MessageController::class , "store"])->name("message.store");
Route::delete("/message/{id}",[MessageController::class ,"destory"])->name("message.destory");
Route::get("/loadMoreMessage/{id}",[MessageController::class, "loadOlder"])->name("message.loadOlder");

});
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});
Route::get("/test",[User::class , "getUserExceptCurrentUser"]);
require __DIR__.'/auth.php';
