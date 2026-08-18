<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            $table->unsignedBigInteger('target_branch_id')
                ->nullable()
                ->after('branch_id');

            $table->foreign('target_branch_id')
                ->references('id')
                ->on('branches')
                ->nullOnDelete();

            $table->index(
                ['branch_id', 'target_branch_id', 'mutation_type'],
                'idx_payments_transfer'
            );
        });
    }

    public function down(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            $table->dropForeign(['target_branch_id']);
            $table->dropIndex('idx_payments_transfer');
            $table->dropColumn('target_branch_id');
        });
    }
};
