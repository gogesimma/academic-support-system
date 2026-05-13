import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { userService } from '../../services/userService';
import { Star, BookOpen } from 'lucide-react';
import { Link } from 'react-router';
import type { Tutor } from '../../types/main';

export const BrowseTutorsPage: React.FC = () => {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const data = await userService.getTutors(true); // Only approved tutors
        setTutors(data);
      } catch (error) {
        console.error('Error fetching tutors:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTutors();
  }, []);

  const filteredTutors = filter === 'all'
    ? tutors
    : tutors.filter((tutor) =>
        tutor.subjects?.some((subject) => subject.category === filter)
      );

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 rounded-3xl p-8 text-white shadow-2xl">
          <h1 className="text-4xl font-bold">Browse Expert Tutors</h1>
          <p className="text-white/90 mt-2 text-lg">Find the perfect tutor for your learning needs</p>
        </div>

        {/* Filters */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-3">
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                onClick={() => setFilter('all')}
                className={filter === 'all' ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg' : 'border-purple-200 hover:bg-purple-50'}
              >
                All Subjects
              </Button>
              <Button
                variant={filter === 'economics' ? 'default' : 'outline'}
                onClick={() => setFilter('economics')}
                className={filter === 'economics' ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg' : 'border-blue-200 hover:bg-blue-50'}
              >
                Economics
              </Button>
              <Button
                variant={filter === 'supply-chain' ? 'default' : 'outline'}
                onClick={() => setFilter('supply-chain')}
                className={filter === 'supply-chain' ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg' : 'border-green-200 hover:bg-green-50'}
              >
                Supply Chain
              </Button>
              <Button
                variant={filter === 'finance-accounting' ? 'default' : 'outline'}
                onClick={() => setFilter('finance-accounting')}
                className={filter === 'finance-accounting' ? 'bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-700 hover:to-yellow-700 shadow-lg' : 'border-orange-200 hover:bg-orange-50'}
              >
                Finance & Accounting
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tutors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTutors.map((tutor, index) => (
            <Card key={tutor.id} className="border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all hover:scale-105">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-14 h-14 bg-gradient-to-br ${
                      index % 3 === 0
                        ? 'from-purple-500 to-pink-500'
                        : index % 3 === 1
                        ? 'from-blue-500 to-cyan-500'
                        : 'from-orange-500 to-yellow-500'
                    } rounded-xl flex items-center justify-center text-white text-lg font-bold shadow-lg`}>
                      {tutor.firstName[0]}{tutor.lastName[0]}
                    </div>
                    <div>
                      <CardTitle className="text-lg bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        {tutor.firstName} {tutor.lastName}
                      </CardTitle>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-semibold text-gray-700">{tutor.rating.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4 text-gray-600">{tutor.bio}</CardDescription>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-semibold mb-2 text-gray-700">Subjects:</p>
                    <div className="flex flex-wrap gap-2">
                      {tutor.subjects?.map((subject, subIndex) => (
                        <span
                          key={subject.id}
                          className={`px-3 py-1 rounded-lg text-xs font-medium ${
                            subIndex % 3 === 0
                              ? 'bg-purple-100 text-purple-700'
                              : subIndex % 3 === 1
                              ? 'bg-pink-100 text-pink-700'
                              : 'bg-orange-100 text-orange-700'
                          }`}
                        >
                          {subject.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  {tutor.hourlyRate && (
                    <div className="flex items-center justify-between pt-3 border-t border-purple-100">
                      <span className="text-sm text-gray-600 font-medium">Hourly Rate:</span>
                      <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        ${tutor.hourlyRate}
                      </span>
                    </div>
                  )}

                  <Link to={`/dashboard/book-session/${tutor.id}`} className="block">
                    <Button className={`w-full mt-2 shadow-lg ${
                      index % 3 === 0
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                        : index % 3 === 1
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700'
                        : 'bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-700 hover:to-yellow-700'
                    }`}>
                      <BookOpen className="w-4 h-4 mr-2" />
                      Book Session
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTutors.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">No tutors found in this category</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
