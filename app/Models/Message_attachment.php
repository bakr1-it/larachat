<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Message_attachment extends Model
{
    protected $fillable = [
        'name',
        'path',
        'mime',
        'size',
        'message_id',
    ];
}
