<?php

use App\Http\Controllers\GroupController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserController;
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
Route::delete("/message/{id}",[MessageController::class ,"destroy"])->name("message.destory");
Route::get("/loadMoreMessage/{id}",[MessageController::class, "loadOlder"])->name("message.loadOlder");
/**
 * todo route for group
 *
 */
Route::post("group",[GroupController::class, "store"])->name("group.store");
Route::put("group/{group}",[GroupController::class,"update"])->name("group.update");
Route::delete("group/{group}",[GroupController::class , "destroy"])->name("group.destory");
Route::middleware(["admin"])->group(function(){
Route::post("user/create",[UserController::class,"store"])->name("user.store");
Route::post("user/block/{id}",[UserController::class,"blockUnblock"])->name("user.blockUnblock");

});

/**
 * ! end for all route for group
 */

});
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});
Route::get("/test",[User::class , "getUserExceptCurrentUser"]);
require __DIR__.'/auth.php';
