<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ListTable extends Model
{
    protected $table = 'list_tables';
    protected $guarded = [];

    public function TaskTable(): HasMany{
     return $this->hasMany(TaskTable::class);
    }

    public function User(): BelongsTo{
        return $this->belongsTo(User::class);
    }

}
