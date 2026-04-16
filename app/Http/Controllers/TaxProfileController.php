<?php

namespace App\Http\Controllers;

use App\Models\Tax;
use App\Models\TaxProfile;
use App\Models\TaxProfileItem;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class TaxProfileController extends Controller
{
    public function index()
    {
        return Inertia::render('Config/TaxProfileList', [
            'profiles' => TaxProfile::with('items')->orderBy('id', 'desc')->get(),
            'taxes' => Tax::where('is_active', true)->orderBy('tax_name', 'asc')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'total_percentage' => 'required|numeric|min:0',
            'items' => 'required|array',
            'items.*.tax_name' => 'required|string',
            'items.*.percentage' => 'nullable|numeric|min:0',
            'items.*.applicable_on' => 'nullable|string|in:interstate,intrastate,union_territory',
        ]);

        DB::transaction(function () use ($validated) {
            $profile = TaxProfile::create([
                'name' => $validated['name'],
                'total_percentage' => $validated['total_percentage'],
                'is_active' => true,
            ]);

            foreach ($validated['items'] as $item) {
                if (isset($item['percentage']) && $item['percentage'] !== null) {
                    $profile->items()->create([
                        'tax_name' => $item['tax_name'],
                        'percentage' => $item['percentage'],
                        'applicable_on' => $item['applicable_on'] ?? null,
                    ]);
                }
            }
        });

        return redirect()->back()->with('success', 'Tax Profile created successfully.');
    }

    public function update(Request $request, TaxProfile $taxProfile)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'total_percentage' => 'required|numeric|min:0',
            'items' => 'required|array',
            'items.*.tax_name' => 'required|string',
            'items.*.percentage' => 'nullable|numeric|min:0',
            'items.*.applicable_on' => 'nullable|string|in:interstate,intrastate,union_territory',
        ]);

        DB::transaction(function () use ($validated, $taxProfile) {
            $taxProfile->update([
                'name' => $validated['name'],
                'total_percentage' => $validated['total_percentage'],
            ]);

            $taxProfile->items()->delete();

            foreach ($validated['items'] as $item) {
                if (isset($item['percentage']) && $item['percentage'] !== null) {
                    $taxProfile->items()->create([
                        'tax_name' => $item['tax_name'],
                        'percentage' => $item['percentage'],
                        'applicable_on' => $item['applicable_on'] ?? null,
                    ]);
                }
            }
        });

        return redirect()->back()->with('success', 'Tax Profile updated successfully.');
    }

    public function destroy(TaxProfile $taxProfile)
    {
        $taxProfile->delete();
        return redirect()->back()->with('success', 'Tax Profile deleted successfully.');
    }
}
