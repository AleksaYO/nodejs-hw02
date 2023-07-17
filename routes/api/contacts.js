const express = require("express");
const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContacts,
} = require("../../models/contacts");
const validateBody = require("../../utils/validator");

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

router.post("/", validateBody(), async (req, res, next) => {
  try {
    const newContact = await addContact(req.body);
    res.status(201).json(newContact);
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

router.put("/:contactId", validateBody(), async (req, res, next) => {
  try {
    const contacts = await updateContacts(req.params.contactId, req.body);
    res.json(contacts);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
