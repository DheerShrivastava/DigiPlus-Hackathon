import Customer from "../models/Customer.js";

export async function getCustomers(req, res, next) {
  try {
    const customers = await Customer.find().sort({ relationshipScore: -1, totalSpend: -1 });
    res.json({ success: true, count: customers.length, data: customers });
  } catch (err) {
    next(err);
  }
}

export async function getCustomerById(req, res, next) {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ success: false, message: "Customer not found" });
    }
    res.json({ success: true, data: customer });
  } catch (err) {
    next(err);
  }
}

export async function createCustomer(req, res, next) {
  try {
    const customer = await Customer.create(req.body);
    res.status(201).json({ success: true, data: customer });
  } catch (err) {
    next(err);
  }
}

export async function updateCustomer(req, res, next) {
  try {
    const updated = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: "Customer not found" });
    }
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
}

export async function deleteCustomer(req, res, next) {
  try {
    await Customer.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Customer deleted successfully" });
  } catch (err) {
    next(err);
  }
}
