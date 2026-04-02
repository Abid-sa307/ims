<?php

namespace App\Http\Controllers;

use App\Models\ItemType;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ItemTypeController extends Controller
{
    public function index()
    {
        return Inertia::render('Inventory/ItemType', [
            'types' => ItemType::all()
        ]);
    }

    public function store(Request $request)
    {
        $request->validate(['name' => 'required|string|max:255']);
        ItemType::create($request->all());
        return redirect()->back();
    }

    public function update(Request $request, ItemType $itemType)
    {
        $request->validate(['name' => 'required|string|max:255']);
        $itemType->update($request->all());
        return redirect()->back();
    }

    public function destroy(ItemType $itemType)
    {
        $itemType->delete();
        return redirect()->back();
    }
}
