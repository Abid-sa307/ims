<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Customer;
use Inertia\Inertia;

class CustomerController extends Controller
{
    public function index()
    {
        $customers = Customer::latest()->get();
        return Inertia::render('Config/CustomerMaster', [
            'customers' => $customers
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_name' => 'required|string|max:255',
            'customer_category' => 'nullable|string|max:255',
            'contact_number' => 'nullable|string|max:255',
            'email_address' => 'nullable|email|max:255',
        ]);

        Customer::create($validated);

        return redirect()->back()->with('success', 'Customer created successfully.');
    }

    public function update(Request $request, $id)
    {
        $customer = Customer::findOrFail($id);
        $validated = $request->validate([
            'customer_name' => 'required|string|max:255',
            'customer_category' => 'nullable|string|max:255',
            'contact_number' => 'nullable|string|max:255',
            'email_address' => 'nullable|email|max:255',
        ]);

        $customer->update($validated);

        return redirect()->back()->with('success', 'Customer updated successfully.');
    }

    public function destroy($id)
    {
        $customer = Customer::findOrFail($id);
        $customer->delete();
        return redirect()->back()->with('success', 'Customer deleted successfully.');
    }
}
