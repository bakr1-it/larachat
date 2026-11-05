<?php

namespace App\Http\Requests;

use App\Models\Group;
use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class StoreMessageRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        if($this->group_id){
            $group= Group::findOrFail($this->group_id);
           return $group->users()->where("users.id",Auth::id())->exists();

        }
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            "body"=>[
                "string",
                "nullable"
            ],
            "group_id"=>[
                "required_without:receiver_id",
                "nullable",
                Rule::exists("groups","id")

            ],
            "receiver_id"=>[
                "required_without:group_id",
                "nullable",
                Rule::exists("users","id")

            ],
            "attachments"=>["nullable","array","max:10"],
            "attachments.*"=>["file","max:102400"],
        ];
    }
}
