
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { Medal } from "lucide-react";

// Mock data fetching functions
// In a real application, you would fetch this data from your database.

const getGeneralRanking = async () => {
  // Mock data for general ranking
  return [
    { id: "1", firstName: "John", lastName: "Doe", score: 95.5, avatar: "/images/user/user-01.jpg" },
    { id: "2", firstName: "Jane", lastName: "Smith", score: 92.1, avatar: "/images/user/user-02.jpg" },
    { id: "3", firstName: "Peter", lastName: "Jones", score: 89.8, avatar: "/images/user/user-03.jpg" },
    { id: "4", firstName: "Mary", lastName: "Johnson", score: 88.2, avatar: "/images/user/user-04.jpg" },
    { id: "5", firstName: "David", lastName: "Williams", score: 87.9, avatar: "/images/user/user-05.jpg" },
  ];
};

const getAreas = async () => {
  // Mock data for areas
  return [
    { id: "1", nombre: "Matemáticas" },
    { id: "2", nombre: "Lectura Crítica" },
    { id: "3", nombre: "Ciencias Naturales" },
    { id: "4", nombre: "Ciencias Sociales" },
    { id: "5", nombre: "Inglés" },
  ];
}

const getRankingByArea = async (areaId: string) => {
  // Mock data for ranking by area
  const rankings: Record<string, Array<{ id: string; firstName: string; lastName: string; score: number; avatar: string }>> = {
    "1": [
      { id: "1", firstName: "John", lastName: "Doe", score: 98.2, avatar: "/images/user/user-01.jpg" },
      { id: "6", firstName: "Emily", lastName: "Brown", score: 96.5, avatar: "/images/user/user-06.jpg" },
      { id: "7", firstName: "Michael", lastName: "Davis", score: 94.3, avatar: "/images/user/user-07.jpg" },
    ],
    "2": [
        { id: "2", firstName: "Jane", lastName: "Smith", score: 98.2, avatar: "/images/user/user-02.jpg" },
        { id: "8", firstName: "Jessica", lastName: "Miller", score: 96.5, avatar: "/images/user/user-08.jpg" },
        { id: "9", firstName: "Chris", lastName: "Wilson", score: 94.3, avatar: "/images/user/user-09.jpg" },
    ],
    "3": [
        { id: "3", firstName: "Peter", lastName: "Jones", score: 98.2, avatar: "/images/user/user-03.jpg" },
        { id: "10", firstName: "Sarah", lastName: "Moore", score: 96.5, avatar: "/images/user/user-10.jpg" },
        { id: "11", firstName: "Daniel", lastName: "Taylor", score: 94.3, avatar: "/images/user/user-11.jpg" },
    ],
    "4": [
        { id: "4", firstName: "Mary", lastName: "Johnson", score: 98.2, avatar: "/images/user/user-04.jpg" },
        { id: "12", firstName: "Laura", lastName: "Anderson", score: 96.5, avatar: "/images/user/user-12.jpg" },
        { id: "13", firstName: "Kevin", lastName: "Thomas", score: 94.3, avatar: "/images/user/user-13.jpg" },
    ],
    "5": [
        { id: "5", firstName: "David", lastName: "Williams", score: 98.2, avatar: "/images/user/user-05.jpg" },
        { id: "14", firstName: "Linda", lastName: "Jackson", score: 96.5, avatar: "/images/user/user-14.jpg" },
        { id: "15", firstName: "Brian", lastName: "White", score: 94.3, avatar: "/images/user/user-15.jpg" },
    ],
  };
  return rankings[areaId] || [];
};


export default async function RankingPage() {
  const generalRanking = await getGeneralRanking();
  const areas = await getAreas();

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Ranking de Estudiantes</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-center">Top 5 Estudiantes - Puntaje General</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {generalRanking.map((user, index) => (
              <li key={user.id} className="flex items-center p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-sm">
                <div className="flex items-center space-x-4">
                  {index < 3 && (
                    <Medal
                      className={`w-8 h-8 ${
                        index === 0 ? "text-yellow-500" : index === 1 ? "text-gray-400" : "text-yellow-700"
                      }`}
                    />
                  )}
                  <span className={`text-xl font-bold ${index >=3 && "ml-12"}`}>{index + 1}</span>
                  <Avatar>
                    <AvatarImage src={user.avatar} alt={`${user.firstName} ${user.lastName}`} />
                    <AvatarFallback>{user.firstName[0]}{user.lastName?.[0]}</AvatarFallback>
                  </Avatar>
                  <span className="text-lg font-medium">{user.firstName} {user.lastName}</span>
                </div>
                <div className="ml-auto text-xl font-bold text-primary">{user.score.toFixed(1)}</div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {areas.map(async (area) => {
          const areaRanking = await getRankingByArea(area.id);
          return (
            <Card key={area.id}>
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-center">{area.nombre}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {areaRanking.map((user, index) => (
                    <li key={user.id} className="flex items-center space-x-3">
                       <span className="text-lg font-semibold">{index + 1}.</span>
                       <Avatar className="w-8 h-8">
                         <AvatarImage src={user.avatar} alt={`${user.firstName} ${user.lastName}`} />
                         <AvatarFallback>{user.firstName[0]}{user.lastName?.[0]}</AvatarFallback>
                       </Avatar>
                      <span className="font-medium">{user.firstName} {user.lastName}</span>
                      <span className="ml-auto font-semibold text-primary">{user.score.toFixed(1)}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}