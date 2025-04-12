/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import userService from "@/services/user.service"; // Import userService
import uploadService from "@/services/upload.service"; // Import uploadService
import addressService from "@/services/address.service"; // New service for address management
import { useAuth } from "@/hooks/use-auth"; // Import useAuth hook
import { IUser, IAddress } from "@/types/backend"; // Ensure IUser and IAddress are imported
import { toast } from "react-toastify"; // Import toast for notifications
// import dynamic from "next/dynamic"

// Dynamically import the Map component to avoid SSR issues
// const Map = dynamic(() => import("@/components/map"), { ssr: false })

export default function ProfilePage() {
  const { isAuthenticated } = useAuth(); // Get authentication state
  const [user, setUser] = useState<IUser>({
    fullName: "",
    email: "",
    phoneNumber: "",
    avatar: "", // Change photo to avatar
    password: "",
    role: "ROLE_USER", // Set a default role
    isActive: true, // Ensure isActive is present and set to a default value
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [addresses, setAddresses] = useState<IAddress[]>([]);
  const [newAddress, setNewAddress] = useState<IAddress>({
    latitude: 0,
    longitude: 0,
    description: "",
    userId: 0,
  });
  const [provinces, setProvinces] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      if (isAuthenticated) {
        try {
          const response = await userService.getUserById(
            Number(localStorage.getItem("id"))
          ); // Replace with actual user ID
          setUser(response.data);
          const addressesResponse = await addressService.getAddressesByUserId(
            Number(localStorage.getItem("id"))
          );
          setAddresses(addressesResponse.data);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };
    fetchUserData();
    fetchProvinces();
  }, [isAuthenticated]);

  const fetchProvinces = async () => {
    try {
      const response = await fetch("https://provinces.open-api.vn/api/p/");
      const data = await response.json();
      setProvinces(data);
    } catch (error) {
      console.error("Error fetching provinces:", error);
    }
  };

  const fetchDistricts = async (provinceCode: string) => {
    try {
      const response = await fetch(
        `https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`
      );
      const data = await response.json();
      setDistricts(data.districts);
    } catch (error) {
      console.error("Error fetching districts:", error);
    }
  };

  const fetchWards = async (districtCode: string) => {
    try {
      const response = await fetch(
        `https://provinces.open-api.vn/api/d/${districtCode}?depth=2`
      );
      const data = await response.json();
      setWards(data.wards);
    } catch (error) {
      console.error("Error fetching wards:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setAvatarFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let avatarUrl = user.avatar;

      // If avatar file is selected, upload it
      if (avatarFile) {
        const uploadResponse = await uploadService.uploadImage(avatarFile);
        avatarUrl = uploadResponse.data.imageUrl; // Get the URL from the upload response
      }

      const updatedUser: IUser = {
        ...user,
        avatar: avatarUrl,
        phoneNumber: user.phoneNumber || null, // Ensure phoneNumber is not null
      };

      const response = await userService.updateUser(
        Number(localStorage.getItem("id")),
        updatedUser
      );
      localStorage.setItem("avatar", response.data.avatar);
      window.location.reload(); // Reload the page to reflect changes
      console.log("Cập nhật thông tin thành công:", response.data);
      toast.success("Cập nhật thông tin thành công!"); // Show success message
      // Show success message
      // Optionally, you can redirect or perform other actions here
    } catch (error) {
      console.error("Cập nhật thông tin thất bại:", error);
      toast.error("Cập nhật thông tin thất bại."); // Show error message
    }
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      //kiểm tra nếu như nhập thiếu tỉnh huyện xã thì không cho thêm địa chỉ
      if (!selectedProvince || !selectedDistrict || !selectedWard) {
        toast.error("Vui lòng chọn đầy đủ tỉnh, huyện, xã.");
        return;
      }

      // Get the names of the selected province, district, and ward
      const provinceName =
        provinces.find(
          (province) => province.code.toString() === selectedProvince
        )?.name || "";
      const districtName =
        districts.find(
          (district) => district.code.toString() === selectedDistrict
        )?.name || "";
      const wardName =
        wards.find((ward) => ward.code.toString() === selectedWard)?.name || "";

      // Create the full address description with names
      const fullAddress = `${newAddress.description}, ${wardName}, ${districtName}, ${provinceName}`;

      const addressToSubmit = {
        ...newAddress,
        description: fullAddress,
        userId: Number(localStorage.getItem("id")),
      };

      const response = await addressService.addAddress(addressToSubmit);
      setAddresses((prev) => [...prev, response.data]);
      setNewAddress({ latitude: 0, longitude: 0, description: "", userId: 0 });
      setSelectedProvince("");
      setSelectedDistrict("");
      setSelectedWard("");
      toast.success("Thêm địa chỉ thành công!");
    } catch (error) {
      console.error("Thêm địa chỉ thất bại:", error);
      toast.error("Thêm địa chỉ thất bại.");
    }
  };

  const handleDeleteAddress = async (addressId: number) => {
    try {
      await addressService.deleteAddress(addressId);
      setAddresses((prev) =>
        prev.filter((address) => address.locationId !== addressId)
      );
      toast.success("Xóa địa chỉ thành công!");
    } catch (error) {
      console.log("Xóa địa chỉ thất bại:", error);
      toast.error(error || "Xóa địa chỉ thất bại.");
    }
  };

  return (
    <>
      <h1 className="text-2xl font-bold mb-8">Quản lý thông tin cá nhân</h1>

      {/* Basic Info */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
        <h2 className="text-xl font-semibold mb-6">Thông tin cơ bản</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <Label htmlFor="fullName">Họ tên</Label>
              <Input
                id="fullName"
                name="fullName"
                value={user.fullName}
                onChange={handleChange}
                className="mt-1"
                required
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={user.email}
                onChange={handleChange}
                className="mt-1"
                required
                disabled // Disable email field as per the admin modal
              />
            </div>

            <div>
              <Label htmlFor="phoneNumber">Số điện thoại</Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                value={user.phoneNumber || ""}
                onChange={handleChange}
                placeholder="Số điện thoại của bạn"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="avatar">Ảnh đại diện</Label>
              <div className="flex mt-1">
                <Input
                  id="avatar"
                  type="file"
                  onChange={handleFileChange}
                  className="col-span-3"
                  accept="image/*"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" className="bg-teal-600 hover:bg-teal-700">
                Cập nhật hồ sơ
              </Button>
            </div>
          </div>
        </form>
      </div>

      {/* Address Management */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
        <h2 className="text-xl font-semibold mb-6">Quản lý Địa chỉ</h2>
        <form onSubmit={handleAddressSubmit} className="space-y-4">
          <div>
            <Label htmlFor="description">Mô tả địa chỉ</Label>
            <Input
              id="description"
              name="description"
              value={newAddress.description}
              onChange={handleAddressChange}
              placeholder="Ví dụ: Nhà riêng, Công ty..."
              className="mt-1"
              required
            />
          </div>
          <div>
            <Label htmlFor="province">Tỉnh/Thành phố</Label>
            <Select
              onValueChange={(value) => {
                setSelectedProvince(value);
                fetchDistricts(value);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn Tỉnh/Thành phố" />
              </SelectTrigger>
              <SelectContent>
                {provinces.map((province) => (
                  <SelectItem
                    key={province.code}
                    value={province.code.toString()}
                  >
                    {province.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="district">Quận/Huyện</Label>
            <Select
              onValueChange={(value) => {
                setSelectedDistrict(value);
                fetchWards(value);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn Quận/Huyện" />
              </SelectTrigger>
              <SelectContent>
                {districts.map((district) => (
                  <SelectItem
                    key={district.code}
                    value={district.code.toString()}
                  >
                    {district.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="ward">Phường/Xã</Label>
            <Select onValueChange={(value) => setSelectedWard(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn Phường/Xã" />
              </SelectTrigger>
              <SelectContent>
                {wards.map((ward) => (
                  <SelectItem key={ward.code} value={ward.code.toString()}>
                    {ward.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* <div className="margin-top-200">
            <Label>Chọn vị trí trên bản đồ</Label>
            <Map
              onLocationSelect={(lat, lng) => {
                setNewAddress((prev) => ({ ...prev, latitude: lat, longitude: lng }));
              }}
            />
          </div>  */}
          <Button type="submit" className="bg-teal-600 hover:bg-teal-700">
            Thêm địa chỉ
          </Button>
        </form>

        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Địa chỉ đã lưu</h3>
          {addresses.map((address) => (
            <div
              key={address.locationId}
              className="flex justify-between items-center border-b py-2"
            >
              <span>{address.description}</span>
              <Button
                onClick={() => handleDeleteAddress(address.locationId!)}
                variant="destructive"
                size="sm"
              >
                Xóa
              </Button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
