<?php

namespace App\Http\Controllers;

use App\Models\Location;
use App\Models\Supplier;
use App\Models\Customer;
use App\Models\Warehouse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LocationController extends Controller
{
    public function index()
    {
        return Inertia::render('Master/LocationMaster', [
            'locations' => Location::all(),
            'suppliers' => Supplier::select('id', 'supplier_name')->get(),
            'customers' => Customer::select('id', 'customer_name')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'location_legal_name' => 'required|string|max:255|unique:locations,location_legal_name',
        ]);

        // Always use the location name as the warehouse name
        $input = $request->all();
        $input['default_warehouse_name'] = $request->location_legal_name;

        $location = Location::create($input);

        // Auto-create a Warehouse linked to this location
        Warehouse::create([
            'location_id' => $location->id,
            'name'        => $location->location_legal_name,
        ]);

        // Auto-create a Supplier entry mirroring this location
        Supplier::create([
            'supplier_name'        => $location->location_legal_name,
            'location_id'          => $location->id,
            'location'             => $location->location_type,
            'contact_number'       => $location->contact_number,
            'email'                => $location->email,
            'country'              => $location->country,
            'state'                => $location->state,
            'city'                 => $location->city,
            'address'              => $location->address,
            'pincode'              => $location->pincode,
            'gst_number'           => $location->gst_no,
            'pan'                  => $location->pan_no,
            'contact_person_name'  => $location->contact_person_name,
        ]);

        // Auto-create a Customer entry if type is Customer
        if ($location->location_type === 'Customer') {
            $customer = Customer::create([
                'customer_name' => $location->location_legal_name,
                'contact_number' => $location->contact_number,
                'email_address' => $location->email,
            ]);
            $location->update(['customer_id' => $customer->id]);
        }

        return redirect()->route('location-master.index')
            ->with('success', 'Location, warehouse and supplier created successfully.');
    }

    public function update(Request $request, Location $location_master)
    {
        $request->validate([
            'location_legal_name' => 'required|string|max:255|unique:locations,location_legal_name,' . $location_master->id,
        ]);

        $input = $request->all();
        $input['default_warehouse_name'] = $request->location_legal_name;

        $location_master->update($input);

        // Sync warehouse name to match location name
        $warehouse = Warehouse::where('location_id', $location_master->id)->first();
        if ($warehouse) {
            $warehouse->update(['name' => $location_master->location_legal_name]);
        } else {
            Warehouse::create([
                'location_id' => $location_master->id,
                'name'        => $location_master->location_legal_name,
            ]);
        }

        // Sync Customer if type is Customer
        if ($location_master->location_type === 'Customer') {
            $customer = Customer::where('customer_name', $location_master->location_legal_name)->first();
            if ($customer) {
                $customer->update([
                    'contact_number' => $location_master->contact_number,
                    'email_address' => $location_master->email,
                ]);
            } else {
                $newCustomer = Customer::create([
                    'customer_name' => $location_master->location_legal_name,
                    'contact_number' => $location_master->contact_number,
                    'email_address' => $location_master->email,
                ]);
                $location_master->update(['customer_id' => $newCustomer->id]);
            }
        }

        return redirect()->route('location-master.index')
            ->with('success', 'Location updated successfully.');
    }

    public function destroy(Location $location_master)
    {
        $location_master->delete();
        return redirect()->route('location-master.index')
            ->with('success', 'Location deleted successfully.');
    }
}
