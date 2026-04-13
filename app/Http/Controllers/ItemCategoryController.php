<?php

namespace App\Http\Controllers;

use App\Models\ItemCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ItemCategoryController extends Controller
{
    public function index()
    {
        return Inertia::render('Inventory/ItemCategory', [
            'categories' => ItemCategory::all()
        ]);
    }

    public function store(Request $request)
    {
        $request->validate(['name' => 'required|string|max:255|unique:item_categories,name']);
        ItemCategory::create($request->only('name'));
        return redirect()->back();
    }

    public function update(Request $request, ItemCategory $itemCategory)
    {
        $request->validate(['name' => 'required|string|max:255|unique:item_categories,name,' . $itemCategory->id]);
        $itemCategory->update($request->only('name'));
        return redirect()->back();
    }

    public function destroy(ItemCategory $itemCategory)
    {
        $itemCategory->delete();
        return redirect()->back();
    }
}
