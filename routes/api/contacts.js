const express = require("express");
const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContacts,
} = require("../../models/contacts");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const contacts = await listContacts();
    res.json(contacts);
  } catch (error) {
    next(error);
  }
});

router.get("/:contactId", async (req, res, next) => {
  try {
    const contact = await getContactById(req.params.contactId);
    if (contact) {
      res.json(contact);
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;
    if (name && email && phone) {
      const newContact = await addContact(req.body);
      res.status(201).json(newContact);
    } else {
      res.status(400).json({ message: "Missing required field" });
    }
  } catch (error) {
    next(error);
  }
});

router.delete("/:contactId", async (req, res, next) => {
  try {
    const delContact = await removeContact(req.params.contactId);
    if (delContact) res.json({ message: "Contact delete" });
    else res.status(404).json({ message: "Not Found" });
  } catch (error) {
    next(error);
  }
});

router.put("/:contactId", async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;
    if (name && email && phone) {
      const contacts = await updateContacts(req.params.contactId, req.body);
      res.json(contacts);
    } else {
      res.status(400).json({ message: "Missing fields" });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
