<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('messages', function (Blueprint $table) {
            $table->id();
            $table->longText("body")->nullable();
            $table->foreignId("sender_id")->constrained("user","id");
            $table->foreignId("recevier_id")->nullable()->constrained("user","id");
            $table->foreignId("conversation_id")->nullable()->constrained("conversations");
            $table->foreignId("group_id")->nullable()->constrained("groups");

            $table->timestamps();
        });
        Schema::table('groups', function (Blueprint $table) {
            $table->foreignId("last_message_id")->nullable()->constrained("messages")->cascadeOnDelete();
        });
        Schema::table('conversations', function (Blueprint $table) {
            $table->foreignId("last_message_id")->nullable()->constrained("messages")->cascadeOnDelete();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('messages');
    }
};
