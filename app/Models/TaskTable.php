<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TaskTable extends Model
{
    protected $guarded = [];

    public function List(): BelongsTo{
        return $this->belongsTo(ListTable::class, 'list_tables_id');
    }
}
