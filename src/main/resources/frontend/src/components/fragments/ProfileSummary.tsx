import React from 'react';
import { Award } from 'lucide-react';

interface ProfileSummaryProps {
  user: any;
}

const ProfileSummary: React.FC<ProfileSummaryProps> = ({ user }) => {
  return (
    <div className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg p-6 shadow-lg">
      <div className="flex items-center gap-6">
        {/* Avatar */}
        <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-4 border-white/50">
          {user.avatar ? (
            <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
          ) : (
            <span className="text-3xl">{user.name?.charAt(0) || 'U'}</span>
          )}
        </div>

        {/* User Info */}
        <div className="flex-grow">
          <h2 className="text-2xl mb-1">{user.name}</h2>
          <p className="opacity-90 text-sm">{user.email}</p>
          <div className="flex items-center gap-2 mt-3">
            <Award className="w-5 h-5" />
            <span className="text-sm">Thành viên {user.memberLevel || 'Bạc'}</span>
          </div>
        </div>

        {/* Points */}
        <div className="text-center bg-white/20 backdrop-blur-sm rounded-lg px-6 py-4 border border-white/30">
          <div className="text-3xl">{user.points || 0}</div>
          <div className="text-sm opacity-90 mt-1">Điểm tích lũy</div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSummary;
