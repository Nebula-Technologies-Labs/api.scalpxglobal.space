import AdminMdodel from "../models/admin.model.js";

export async function createAdminIfNotExists() {
  const adminExists = await AdminMdodel.findOne({ isAdmin: true });
  if (!adminExists) {
    const admin = new AdminMdodel({
      userName: "admin",
      userId: "admin001",
      password: "admin123",
    });
    await admin.save();
    console.log("Admin user created");
  } else {
    console.log("Admin user already exists");
  }
}

createAdminIfNotExists().catch((error) => {
  console.error("Error creating admin user:", error);
});
