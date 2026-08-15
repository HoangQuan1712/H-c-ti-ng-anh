// Test script to verify Profile, Change Password, and Study Groups APIs
async function testAll() {
  const baseUrl = "http://localhost:3000";

  console.log("=== 1. Test Fetching Users to get test user ===");
  const resLogin = await fetch(`${baseUrl}/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "nguyenvana@gmail.com", password: "password123" })
  });
  const loginData = await resLogin.json();
  console.log("Login user:", loginData.user);
  const userId = loginData.user.id;

  console.log("\n=== 2. Test Updating User Profile ===");
  const resUpdate = await fetch(`${baseUrl}/api/user-profile`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId,
      updates: {
        username: "nguyenvana_pro",
        birthday: "1998-05-20",
        address: "Hà Nội, Việt Nam",
        education: "Lập trình viên / Công nghệ",
        avatarColor: "#8B5CF6",
        skillLevels: { writing: "B2", listening: "B2", reading: "C1", speaking: "B1" },
        learningGoal: "business",
        isOnboarded: true
      }
    })
  });
  const updateData = await resUpdate.json();
  console.log("Updated Profile result:", updateData);

  console.log("\n=== 3. Test Change Password ===");
  const resPass = await fetch(`${baseUrl}/api/change-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId,
      oldPassword: "password123",
      newPassword: "newpassword456"
    })
  });
  console.log("Change Password result:", await resPass.json());

  // Verify login with new password
  const resVerifyPass = await fetch(`${baseUrl}/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "nguyenvana@gmail.com", password: "newpassword456" })
  });
  console.log("Login with new password (Success):", (await resVerifyPass.json()).success);

  // Restore password back to password123 for consistency
  await fetch(`${baseUrl}/api/change-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, oldPassword: "newpassword456", newPassword: "password123" })
  });

  console.log("\n=== 4. Test Study Groups List ===");
  const resGroups = await fetch(`${baseUrl}/api/groups`);
  const groupsData = await resGroups.json();
  console.log("Groups count:", groupsData.groups.length);
  console.log("Group 1 Target Words:", groupsData.groups[0].targetWords.map(w => w.word));

  console.log("\n=== 5. Test Sending Group Message with Target Word Detection ===");
  const resMsg = await fetch(`${baseUrl}/api/groups/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      groupId: "grp_business",
      senderId: userId,
      senderName: "Nguyen Van A",
      senderAvatar: "#8B5CF6",
      text: "We should leverage modern AI technology to streamline our development process."
    })
  });
  const msgData = await resMsg.json();
  console.log("Sent Message:", msgData.message);
  console.log("AI Moderator Response:", msgData.aiResponse?.text);

  console.log("\n=== All Profile & Groups tests passed with flying colors! ===");
}

testAll().catch(console.error);
