"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { User, FileText, BarChart, LogOut } from 'lucide-react';

// Define User and Resource types
interface UserType {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface ResourceType {
  id: number;
  title: string;
  type: string;
  downloads: number;
}

interface StatisticsType {
  totalUsers: number;
  userRoles: { admin: number; faculty: number; student: number };
  totalResources: number;
  totalDownloads: number;
}

// Mock API for admin dashboard
const adminApi = {
  getUsers: async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return [
      { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Student' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Faculty' },
      { id: 3, name: 'Admin User', email: 'admin@example.com', role: 'Admin' },
    ];
  },
  getResources: async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return [
      { id: 1, title: 'Introduction to React', type: 'PDF', downloads: 120 },
      { id: 2, title: 'Advanced JavaScript Concepts', type: 'Video', downloads: 85 },
      { id: 3, title: 'Database Design Principles', type: 'Presentation', downloads: 62 },
    ];
  },
  getStatistics: async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      totalUsers: 150,
      userRoles: { admin: 5, faculty: 45, student: 100 },
      totalResources: 75,
      totalDownloads: 1500,
    };
  },
};

export default function AdminDashboard() {
  // Specify the state types
  const [users, setUsers] = useState<UserType[]>([]);
  const [resources, setResources] = useState<ResourceType[]>([]);
  const [statistics, setStatistics] = useState<StatisticsType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [usersData, resourcesData, statsData] = await Promise.all([
        adminApi.getUsers(),
        adminApi.getResources(),
        adminApi.getStatistics(),
      ]);
      setUsers(usersData);
      setResources(resourcesData);
      setStatistics(statsData);
    } catch (error) {
      toast({
        title: "Error fetching data",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">VRS Admin Dashboard</h1>
        <Button onClick={handleLogout} variant="outline">
          <LogOut className="mr-2 h-4 w-4" /> Logout
        </Button>
      </div>
      <Tabs defaultValue="statistics">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="statistics">Statistics</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>
        <TabsContent value="statistics">
          <Card>
            <CardHeader>
              <CardTitle>Platform Statistics</CardTitle>
              <CardDescription>Overview of VRS platform usage</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p>Loading statistics...</p>
              ) : statistics && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Total Users</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-4xl font-bold">{statistics.totalUsers}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>User Roles</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>Admin: {statistics.userRoles.admin}</p>
                      <p>Faculty: {statistics.userRoles.faculty}</p>
                      <p>Student: {statistics.userRoles.student}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Total Resources</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-4xl font-bold">{statistics.totalResources}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Total Downloads</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-4xl font-bold">{statistics.totalDownloads}</p>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage all users of the VRS platform</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p>Loading users...</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">Edit</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="resources">
          <Card>
            <CardHeader>
              <CardTitle>Resource Management</CardTitle>
              <CardDescription>Manage all resources on the VRS platform</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p>Loading resources...</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Downloads</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {resources.map((resource) => (
                      <TableRow key={resource.id}>
                        <TableCell>{resource.title}</TableCell>
                        <TableCell>{resource.type}</TableCell>
                        <TableCell>{resource.downloads}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">Edit</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
