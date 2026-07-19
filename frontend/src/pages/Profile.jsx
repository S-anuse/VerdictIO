import { useEffect, useState } from "react";
import profileApi from "../api/profileApi";
import dashboardApi from "../api/dashboardApi";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const fetchProfile = async () => {
    try {
      const response = await profileApi.getProfile();
      setProfile(response.data.result);
      setName(response.data.result.name);
      setEmail(response.data.result.email);
      console.log(response.data.result);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchDashboard = async () => {
    try {
      const response = await dashboardApi.getDashboard();
      setDashboard(response.data.result);
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const response = await profileApi.updateProfile({
        name,
        email,
      });

      setProfile(response.data.result);
      setIsEditing(false);

      alert("Profile updated successfully");
    } catch (err) {
      alert(err.response?.data?.message || "Unable to update profile");
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      await profileApi.changePassword({
        currentPassword,
        newPassword,
      });

      alert("Password updated successfully");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setIsChangingPassword(false);
    } catch (err) {
      alert(err.response?.data?.message || "Unable to update password");
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchDashboard();
  }, []);

  if (!profile || !dashboard) return <h1>Loading...</h1>;

  const { statistics } = dashboard;

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md border p-8">
        <h1 className="text-3xl font-bold mb-8">Profile</h1>

        {isChangingPassword ? (
          <div className="space-y-5">
            <div>
              <p className="text-gray-500 text-sm">Current Password</p>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 mt-1"
              />
            </div>

            <div>
              <p className="text-gray-500 text-sm">New Password</p>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 mt-1"
              />
            </div>

            <div>
              <p className="text-gray-500 text-sm">Confirm Password</p>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 mt-1"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <p className="text-gray-500 text-sm">Name</p>

              {isEditing ? (
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                />
              ) : (
                <p className="text-xl font-semibold">{profile.name}</p>
              )}
            </div>

            <div>
              <p className="text-gray-500 text-sm">Email</p>

              {isEditing ? (
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                />
              ) : (
                <p className="text-xl">{profile.email}</p>
              )}
            </div>

            <div>
              <p className="text-gray-500 text-sm">Role</p>
              <p className="text-xl capitalize">{profile.role}</p>
            </div>
          </div>
        )}

        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-6">Coding Statistics</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-100 rounded-lg p-5 border">
              <p className="text-gray-500 text-sm">Problems Solved</p>

              <p className="text-3xl font-bold text-green-600 mt-2">
                {statistics.totalSolved}
              </p>
            </div>

            <div className="bg-slate-100 rounded-lg p-5 border">
              <p className="text-gray-500 text-sm">Total Submissions</p>

              <p className="text-3xl font-bold text-blue-600 mt-2">
                {statistics.totalSubmissions}
              </p>
            </div>

            <div className="bg-slate-100 rounded-lg p-5 border">
              <p className="text-gray-500 text-sm">Acceptance Rate</p>

              <p className="text-3xl font-bold text-purple-600 mt-2">
                {statistics.acceptanceRate}%
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 flex gap-4">
          {isChangingPassword ? (
            <>
              <button
                onClick={handleChangePassword}
                className="px-5 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
              >
                Update Password
              </button>

              <button
                onClick={() => {
                  setCurrentPassword("");
                  setNewPassword("");
                  setConfirmPassword("");
                  setIsChangingPassword(false);
                }}
                className="px-5 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-700"
              >
                Cancel
              </button>
            </>
          ) : isEditing ? (
            <>
              <button
                onClick={handleUpdateProfile}
                className="px-5 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
              >
                Save
              </button>

              <button
                onClick={() => {
                  setName(profile.name);
                  setEmail(profile.email);
                  setIsEditing(false);
                }}
                className="px-5 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-700"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  setIsChangingPassword(false);
                  setIsEditing(true);
                }}
                className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                Edit Profile
              </button>

              <button
                onClick={() => {
                  setIsEditing(false);
                  setIsChangingPassword(true);
                }}
                className="px-5 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-800"
              >
                Change Password
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
