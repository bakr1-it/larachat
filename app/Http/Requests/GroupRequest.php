<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Override;

class GroupRequest extends FormRequest
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
            "name"=>
            [
                "string",
                "required",

            ],
            "descrition"=>
            [
                "nullable",
                "string"
            ],
            "user_ids"=>
            [
                "array",
                "nullable"

            ],
            "user_ids.*"=>
            [
                "integer",
                "exists:users,id"

            ]

        ];
    }

#[Override]
public function validated($key = null, $default = null)
{
    $vaildate= parent::validated($key, $default);
    $vaildate["owner_id"]=$this->user()->id;
    return $vaildate;
}
}
