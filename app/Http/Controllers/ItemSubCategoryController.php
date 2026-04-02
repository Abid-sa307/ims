<?php

namespace App\Http\Controllers;

use App\Models\ItemCategory;
use App\Models\ItemSubCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ItemSubCategoryController extends Controller
{
    public function index()
    {
        return Inertia::render('Inventory/ItemSubCategory', [
            'subCategories' => ItemSubCategory::with('category')->get(),
            'categories' => ItemCategory::all()
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'category_id' => 'required|exists:item_categories,id',
            'name' => 'required|string|max:255'
        ]);
        ItemSubCategory::create($request->all());
        return redirect()->back();
    }

    public function update(Request $request, ItemSubCategory $itemSubCategory)
    {
        $request->validate([
            'category_id' => 'required|exists:item_categories,id',
            'name' => 'required|string|max:255'
        ]);
        $itemSubCategory->update($request->all());
        return redirect()->back();
    }

    public function destroy(ItemSubCategory $itemSubCategory)
    {
        $itemSubCategory->delete();
        return redirect()->back();
    }
}
