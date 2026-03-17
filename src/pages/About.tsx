import React, { useState, useEffect } from 'react';
import { Users, Target, ShieldCheck, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { fetchTeamMembers, type TeamMemberData } from '../services/n8nService';

export const About: React.FC = () => {
  const { t } = useTranslation();
  const [team, setTeam] = useState<TeamMemberData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeamMembers().then(data => {
      setTeam(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-16 animate-slide-up pb-12">
      <div className="text-center py-12">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
          {t('about.title', 'Conoce a nuestro equipo')}
        </h1>
        <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          {t('about.subtitle', 'Profesionales apasionados y dedicados a brindarte la mejor atención. Conócelos a continuación.')}
        </p>
      </div>

      {/* Team Dynamic Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-primary-600 dark:text-primary-400 mb-4" />
          <p className="text-gray-500 dark:text-gray-400">{t('about.loading', 'Cargando a nuestros especialistas...')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {team.map((member) => (
            <div key={member.id} className="bg-white dark:bg-dark-800 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-700 overflow-hidden hover:shadow-md transition-shadow duration-300">
              <div className="h-64 overflow-hidden">
                <img 
                  src={member.imagenUrl} 
                  alt={member.nombre} 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 text-center">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{member.nombre}</h3>
                <p className="text-primary-600 dark:text-primary-400 font-medium mb-4">{t(`about.pro.${member.id}.rol`, member.rol)}</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  {t(`about.pro.${member.id}.desc`, member.descripcion)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Values Section */}
      <div className="pt-8 border-t border-gray-100 dark:border-dark-800">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{t('about.pilarsTitle', 'Nuestros Pilares')}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-50 dark:bg-dark-800/50 p-8 rounded-2xl text-center">
            <div className="mx-auto w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mb-6">
              <Users className="w-8 h-8 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{t('about.pilar1Title', 'Experiencia')}</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">{t('about.pilar1Desc', 'Años de trayectoria garantizan nuestro nivel de servicio.')}</p>
          </div>
          
          <div className="bg-gray-50 dark:bg-dark-800/50 p-8 rounded-2xl text-center">
            <div className="mx-auto w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mb-6">
              <Target className="w-8 h-8 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{t('about.pilar2Title', 'Precisión')}</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">{t('about.pilar2Desc', 'Atención al detalle en cada servicio que ofrecemos.')}</p>
          </div>

          <div className="bg-gray-50 dark:bg-dark-800/50 p-8 rounded-2xl text-center">
            <div className="mx-auto w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mb-6">
              <ShieldCheck className="w-8 h-8 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{t('about.pilar3Title', 'Confianza')}</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">{t('about.pilar3Desc', 'Transparencia y seguridad en la gestión de turnos.')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
