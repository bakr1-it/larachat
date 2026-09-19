<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreMessageRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
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
        ];
    }
}
