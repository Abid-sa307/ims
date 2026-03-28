<?php

namespace App\Imports;

use App\Models\Item;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class ItemImport implements ToModel, WithHeadingRow
{
    /**
    * @param array $row
    *
    * @return \Illuminate\Database\Eloquent\Model|null
    */
    public function model(array $row)
    {
        return new Item([
            'item_name'    => $row['item_name'] ?? $row['name'] ?? null,
            'uom'          => $row['uom'] ?? 'PCS',
            'price'        => $row['price'] ?? 0,
            'tax_percent'  => $row['tax_percent'] ?? $row['tax'] ?? 0,
            'cess_percent' => $row['cess_percent'] ?? $row['cess'] ?? 0,
            'description'  => $row['description'] ?? null,
        ]);
    }
}
