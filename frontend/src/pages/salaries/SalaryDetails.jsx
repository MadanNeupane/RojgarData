import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "@/src/api";
import PageTemplate from "@/src/components/PageTemplate";
import { Card, CardContent } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { toast } from "sonner";
import {
  CalendarDays,
  ShieldCheck,
  UserCircle,
  Building2,
  Briefcase,
  MonitorCheck,
  TrendingUp,
  Clock,
} from "lucide-react";

const SalaryDetails = () => {
  const { id } = useParams();
  const [salary, setSalary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSalary = async () => {
      try {
        const res = await api.get(`/salary/salaries/${id}`);
        setSalary(res.data);
      } catch (error) {
        if (error.response.status === 404) {
          window.location.href = "/404";
        } else {
          toast.error("Failed to fetch salary.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSalary();
  }, [id]);

  const InfoItem = ({ icon: Icon, label, value }) => (
    <span className="flex items-center gap-1">
      <Icon className="w-4 h-4 text-muted-foreground" />
      <strong>{label}:</strong> {value}
    </span>
  );

  return (
    <PageTemplate>
      {loading ? (
        <div className="p-6 text-center">Loading...</div>
      ) : !salary ? (
        <div className="p-6 text-center">Salary data not found.</div>
      ) : (
      <div className="max-w-3xl mx-auto space-y-6">
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-bold">{salary.job_title}</h1>
              {salary.is_verified && (
                <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" />
                  Verified
                </Badge>
              )}
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <InfoItem icon={Building2} label="Company" value={salary.company_name} />
              <InfoItem icon={Briefcase} label="Status" value={salary.work_status} />
              <InfoItem icon={MonitorCheck} label="Work Type" value={salary.work_type.replace("_", " ")} />
              <InfoItem icon={TrendingUp} label="Seniority" value={salary.seniority} />
              <InfoItem icon={Clock} label="Experience" value={`${salary.years_of_experience} years`} />
              <InfoItem icon={CalendarDays} label="Date" value={new Date(salary.created_at).toLocaleDateString()} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <h2 className="text-sm font-semibold mb-1">Base Salary</h2>
                <p className="text-lg font-bold">
                  {salary.currency} {salary.salary_amount.toLocaleString()} / {salary.payment_period}
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <h2 className="text-sm font-semibold mb-1">Bonus</h2>
                <p className="text-lg font-bold">
                  {salary.currency} {salary.bonus.toLocaleString()} / {salary.bonus_payment_period}
                </p>
              </div>
            </div>

            <div className="pt-4 text-sm text-muted-foreground flex items-center gap-2">
              <UserCircle className="w-4 h-4" />
              Submitted {salary.anonymous ? "anonymously" : `by user #${salary.submitted_by}`}
            </div>
          </CardContent>
        </Card>
      </div>
      )}

    </PageTemplate>
  );
}

export default SalaryDetails