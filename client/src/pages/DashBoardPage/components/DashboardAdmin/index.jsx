import { useQuery } from 'react-query';
import { useMemo } from 'react';
import { Card } from 'primereact/card';
import { getQuantityUserAndClass } from 'apis/admin.api';
import { useNavigate } from 'react-router';

export default function DashBoardAdmin() {
  const userId = JSON.parse(localStorage.getItem('user_profile')).id;
  const navigate = useNavigate();
  const header = (
    <img alt="Card" src="https://primefaces.org/cdn/primereact/images/usercard.png" />
  );
  const { data } = useQuery({
    queryKey: ['adminDashboard'],
    queryFn: () => getQuantityUserAndClass(userId)
  });
  const quantityUserAndClass = useMemo(() => data?.data ?? [], [data]);

  const handleNavigate = (ban) => {
    if (ban) {
      navigate('/admin/manageUser');
    } else {
      navigate('/admin/manageClasses');
    }
  };

  return (
    <div className="card flex justify-content-center">
      {quantityUserAndClass?.data?.map((item) => (
        <Card
          title={item.ban ? 'Người dùng' : 'Lớp học'}
          header={header}
          className="md:w-25rem p-2 m-4 cursor-pointer"
          onClick={() => handleNavigate(item.ban)}
        >
          <p className="m-0 font-semibold">
            Số lượng: {item.total.count}
          </p>
          <p className="m-0 mt-2 font-semibold">
            Hoạt động: {item.active.count}
          </p>
          {item.ban && (
            <p className="m-0 mt-2 font-semibold">
              Bị cấm: {item.ban.count}
            </p>
          )}

        </Card>
      ))}

    </div>
  );
}
