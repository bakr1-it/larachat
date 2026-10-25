<?php

namespace App\Http\Controllers;

use App\Http\Requests\GroupRequest;
use App\Http\Requests\UpdateGroupReqest;
use App\Jobs\DeleteGroupJob;
use App\Models\Group;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;

class GroupController extends Controller
{


    /**
     * Store a newly created resource in storage.
     */
    public function store(GroupRequest $request)
    {
        $data=$request->validated();
        $user_ids= $data["user_ids"]??[];
        $group =Group::create($data);
        $group->users()->attach(array_unique([...$user_ids , $request->user()->id]));
        return redirect()->back();

    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateGroupReqest $request, Group $group)
    {
        $data = $request->validated();
        $group->update($data);
        $user_ids= $data["user_ids"]??[];
        $group->users()->sync(array_unique([...$user_ids , $request->user()->id]));

        return redirect()->back();


    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Group $group)
    {
        Gate::authorize("delete",$group);
        DeleteGroupJob::dispatch($group)->delay(now()->addSeconds(10));


        return response()->json(["message"=>"Delete This Group is soon"]);

    }
}
