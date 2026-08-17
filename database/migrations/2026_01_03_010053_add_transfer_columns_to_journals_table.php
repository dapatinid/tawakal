<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('journals', function (Blueprint $table) {
            $table->unsignedBigInteger('pair_journal_id')
                ->nullable()
                ->after('id');

            $table->string('transfer_type')
                ->nullable()
                ->after('code'); // out | in

            $table->foreign('pair_journal_id')
                ->references('id')
                ->on('journals')
                ->nullOnDelete();

            $table->index(['pair_journal_id', 'transfer_type'], 'idx_journals_transfer');
        });
    }

    public function down(): void
    {
        Schema::table('journals', function (Blueprint $table) {
            $table->dropForeign(['pair_journal_id']);
            $table->dropIndex('idx_journals_transfer');
            $table->dropColumn(['pair_journal_id', 'transfer_type']);
        });
    }
};
