"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { UploadCloud, Download, FileText, User, LogOut, Search } from 'lucide-react';

// Define the types for resources and profile
interface Resource {
  id?: number;
  title: string;
  type: string;
  downloads: number;
}

interface Profile {
  name: string;
  email: string;
  role: string;
}											 

// Mock function to simulate API calls
const api = {
  getResources: async () => {
    // Simulating API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return [
      { id: 1, title: 'Introduction to React', type: 'PDF', downloads: 120 },
      { id: 2, title: 'Advanced JavaScript Concepts', type: 'Video', downloads: 85 },
      { id: 3, title: 'Database Design Principles', type: 'Presentation', downloads: 62 },
    ];
  },
  uploadResource: async (resource: Resource) => {
    // Simulating API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { ...resource, id: Date.now(), downloads: 0 };
  },
  searchResources: async (query: string) => {
    // Simulating API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    const allResources = await api.getResources();
    return allResources.filter(resource => 
      resource.title.toLowerCase().includes(query.toLowerCase()) ||
      resource.type.toLowerCase().includes(query.toLowerCase())
    );
  },
  getUserProfile: async () => {
    // Simulating API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      name: 'John Doe',
      email: 'john@example.com',
      role: 'student'
    };
  },
  updateUserProfile: async (profile: Profile) => {
    // Simulating API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return profile;
  }
};

export default function Dashboard() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [newResource, setNewResource] = useState<Resource>({ title: '', type: '', downloads: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const [editProfile, setEditProfile] = useState<Profile>({ name: '', email: '', role: '' });
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    fetchResources();
    fetchUserProfile();
  }, []);

  const fetchResources = async () => {
    setIsLoading(true);
    try {
      const data = await api.getResources();
      setResources(data);
    } catch (error) {
      toast({
        title: "Error fetching resources",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const profile = await api.getUserProfile();
      setUserProfile(profile);
      setEditProfile({ name: profile.name, email: profile.email, role: profile.role });
    } catch (error) {
      toast({
        title: "Error fetching profile",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newResource.title && newResource.type) {
      try {
        const uploadedResource = await api.uploadResource(newResource);
        setResources([...resources, uploadedResource]);
        setNewResource({ title: '', type: '', downloads: 0  });
        toast({
          title: "Resource uploaded",
          description: "Your new resource has been successfully uploaded.",
        });
      } catch (error) {
        toast({
          title: "Upload failed",
          description: "Please try again later.",
          variant: "destructive",
        });
      }
    }
  };

  const handleDownload = (id: number) => {
    setResources(resources.map(r => r.id === id ? { ...r, downloads: (r.downloads || 0) + 1 } : r));
    toast({
      title: "Download started",
      description: "Your resource download has begun.",
    });
  };

  const handleSearch = async () => {
    if (searchQuery) {
      setIsLoading(true);
      try {
        const results = await api.searchResources(searchQuery);
        setResources(results);
      } catch (error) {
        toast({
          title: "Search failed",
          description: "Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updatedProfile = await api.updateUserProfile(editProfile);
      setUserProfile(updatedProfile);
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    router.push('/');
  };

  return (
    <div className="container mx-auto p-4 fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">VRS Dashboard</h1>
        <Button onClick={handleLogout} variant="outline" className="btn">
          <LogOut className="mr-2 h-4 w-4" /> Logout
        </Button>
      </div>
      <Tabs defaultValue="resources" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="upload">Upload</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>
        <TabsContent value="resources" className="space-y-4">
          <Card className="card">
            <CardHeader>
              <CardTitle>Available Resources</CardTitle>
              <CardDescription>Browse and download academic resources</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex mb-4">
                <Input
                  placeholder="Search resources..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="mr-2"
                />
                <Button onClick={handleSearch}>
                  <Search className="mr-2 h-4 w-4" /> Search
                </Button>
              </div>
              {isLoading ? (
                <p>Loading resources...</p>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {resources.map((resource) => (
                    <Card key={resource.id} className="card slide-in">
                      <CardHeader>
                        <CardTitle>{resource.title}</CardTitle>
                        <CardDescription>{resource.type}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p>Downloads: {resource.downloads}</p>
                        <Button onClick={() => handleDownload(resource.id!)} className="mt-2 btn">
                          <Download className="mr-2 h-4 w-4" /> Download
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="upload">
          <Card className="card">
            <CardHeader>
              <CardTitle>Upload New Resource</CardTitle>
              <CardDescription>Share your knowledge with others</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpload} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={newResource.title}
                    onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
                    placeholder="Enter resource title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Input
                    id="type"
                    value={newResource.type}
                    onChange={(e) => setNewResource({ ...newResource, type: e.target.value })}
                    placeholder="Enter resource type (e.g., PDF, Video)"
                  />
                </div>
                <Button type="submit" className="btn">
                  <UploadCloud className="mr-2 h-4 w-4" /> Upload Resource
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="profile">
          <Card className="card">
            <CardHeader>
              <CardTitle>Your Profile</CardTitle>
              <CardDescription>Manage your account settings</CardDescription>
            </CardHeader>
            <CardContent>
              {userProfile ? (
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={editProfile.name}
                      onChange={(e) => setEditProfile({ ...editProfile, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={editProfile.email}
                      onChange={(e) => setEditProfile({ ...editProfile, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Role</Label>
                    <Input value={userProfile.role} disabled />
                  </div>
                  <Button type="submit" className="btn">
                    Update Profile
                  </Button>
                </form>
              ) : (
                <p>Loading profile...</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
