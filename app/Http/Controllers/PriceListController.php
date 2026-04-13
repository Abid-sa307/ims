<?php

namespace App\Http\Controllers;

use App\Models\PriceList;
use App\Models\PriceListItem;
use App\Models\Location;
use App\Models\ItemCategory;
use App\Models\Item;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class PriceListController extends Controller
{
    public function index()
    {
        return Inertia::render('Pricing/PriceList', [
            'locations' => Location::select('id', 'location_legal_name', 'location_type')->get(),
            'categories' => ItemCategory::all(),
            'items' => Item::with('baseUnit')->select('id', 'item_name', 'standard_sale_price', 'tax_percent', 'base_unit_id', 'item_category_id')->get(),
            'priceLists' => PriceList::with(['seller', 'buyer'])->latest()->get(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'price_list_name' => 'required|string|max:255',
            'period_start' => 'required|date',
            'period_end' => 'required|date|after_or_equal:period_start',
            'price_list_items' => 'required|array',
            'price_list_items.*.item_id' => 'required|exists:items,id',
            'price_list_items.*.selling_price' => 'required|numeric',
        ]);

        DB::beginTransaction();
        try {
            $priceList = PriceList::create($request->only([
                'price_list_name', 'price_list_type', 'seller_id', 'applied_on', 
                'buyer_id', 'item_category_id', 'discount_percent', 
                'default_markup_percent', 'period_start', 'period_end'
            ]));

            foreach ($request->price_list_items as $item) {
                PriceListItem::create([
                    'price_list_id' => $priceList->id,
                    'item_id' => $item['item_id'],
                    'selling_price' => $item['selling_price'],
                    'tax_percent' => $item['tax_percent'] ?? null,
                    'uom' => $item['uom'] ?? null,
                ]);
            }

            DB::commit();
            return redirect()->back()->with('success', 'Price list created successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->withErrors(['error' => 'Failed to create price list: ' . $e->getMessage()]);
        }
    }
}
