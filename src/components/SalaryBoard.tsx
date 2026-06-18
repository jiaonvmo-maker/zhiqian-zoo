import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { departments } from '@/data/departments';
import PAHeader from '@/components/pa/PAHeader';
import PABackground from '@/components/pa/PABackground';
import {
  CITY_OPTIONS,
  COMPANY_TIER_OPTIONS,
  getDeptSalary,
  getCompanyTierOption,
  compareAssociateAcrossCompanies,
  formatTierPay,
  estimateAnnualPackage,
  SALARY_DISCLAIMER,
  DATA_VINTAGE,
  type CityTier,
  type CompanyTier,
} from '@/data/salaryReference';

const TIER_BAR_COLORS: Record<string, string> = {
  intern: '#9ca3af',
  associate: '#60a5fa',
  senior: '#f59e0b',
  director: '#a78bfa',
  executive: '#1a1a1a',
};

const COMPANY_COLORS: Record<CompanyTier, string> = {
  t1_platform: '#007aff',
  t2_unicorn: '#5856d6',
  t3_mid: '#34c759',
  t4_growth: '#ff9500',
  t5_early: '#ff6b6b',
};

export default function SalaryBoard() {
  const setPhase = useGameStore((s) => s.setPhase);
  const [companyTier, setCompanyTier] = useState<CompanyTier>('t1_platform');
  const [city, setCity] = useState<CityTier>('tier1');
  const [deptId, setDeptId] = useState(departments[0]?.id ?? 'product');
  const [showCompare, setShowCompare] = useState(false);

  const dept = departments.find((d) => d.id === deptId);
  const profile = useMemo(() => getDeptSalary(deptId, city, companyTier), [deptId, city, companyTier]);
  const companyMeta = getCompanyTierOption(companyTier);
  const cityMeta = CITY_OPTIONS.find((c) => c.id === city)!;
  const compareRows = useMemo(() => compareAssociateAcrossCompanies(deptId), [deptId]);
  const maxSalary = profile.tiers[profile.tiers.length - 1]?.monthlyMax ?? 100;

  return (
    <PABackground variant="warm">
      <PAHeader
        onBack={() => setPhase('entry')}
        icon="💰"
        title="薪资参考板"
        subtitle={`${DATA_VINTAGE} · ${companyMeta.shortLabel} · ${cityMeta.label}`}
        right={
          <button type="button" onClick={() => setPhase('sandbox')} className="pa-btn pa-btn-cream text-xs px-3 py-1.5 h-auto min-h-0">
            🏢 大厦
          </button>
        }
      />

      <div className="absolute inset-0 pt-[5.5rem] pb-8 overflow-y-auto px-4 sm:px-6 z-10">
        <div className="max-w-4xl mx-auto space-y-4 pt-1">
          <section>
            <p className="pa-label text-xs font-extrabold mb-2 px-1" style={{ color: 'var(--pa-brown-mid)' }}>公司梯队</p>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {COMPANY_TIER_OPTIONS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCompanyTier(c.id)}
                  className="shrink-0 px-3 py-2.5 rounded-xl text-left min-w-[108px] transition-all"
                  style={{
                    background: companyTier === c.id ? COMPANY_COLORS[c.id] : '#fff',
                    color: companyTier === c.id ? '#fff' : COMPANY_COLORS[c.id],
                    border: `2px solid ${COMPANY_COLORS[c.id]}`,
                    boxShadow: companyTier === c.id ? `0 4px 0 ${COMPANY_COLORS[c.id]}88` : 'none',
                  }}
                >
                  <p className="text-[11px] font-extrabold leading-tight">{c.label}</p>
                  <p className="text-[8px] font-bold mt-0.5 opacity-85">{c.hint.split(' · ')[0]}</p>
                </button>
              ))}
            </div>
            <p className="text-[9px] font-bold mt-1.5 px-1" style={{ color: '#999' }}>
              代表：{companyMeta.examples}
            </p>
          </section>

          <section>
            <p className="pa-label text-xs font-extrabold mb-2 px-1" style={{ color: 'var(--pa-brown-mid)' }}>城市</p>
            <div className="flex flex-wrap gap-2">
              {CITY_OPTIONS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCity(c.id)}
                  className={`px-4 py-2 text-xs font-extrabold rounded-full transition-all ${city === c.id ? 'pa-btn pa-btn-pink' : 'pa-btn pa-btn-cream'}`}
                >
                  {c.label}
                </button>
              ))}
            </div>
            <p className="text-[9px] font-bold mt-1 px-1" style={{ color: '#aaa' }}>{cityMeta.hint}</p>
          </section>

          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {departments.map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => setDeptId(d.id)}
                className="shrink-0 px-3 py-2 rounded-xl text-[11px] font-extrabold transition-all"
                style={{
                  background: deptId === d.id ? d.color : '#fff',
                  color: deptId === d.id ? '#fff' : d.color,
                  border: `2px solid ${d.color}`,
                  boxShadow: deptId === d.id ? `0 4px 0 ${d.color}88` : 'none',
                }}
              >
                {d.shortName}
              </button>
            ))}
          </div>

          {dept && (
            <motion.div
              key={`${deptId}-${city}-${companyTier}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="pa-panel p-4 sm:p-5"
              style={{ borderColor: dept.color, boxShadow: `0 6px 0 ${dept.color}55` }}
            >
              <div className="flex items-start justify-between gap-3 mb-3 flex-wrap">
                <div>
                  <p className="text-lg font-extrabold" style={{ color: dept.color }}>{dept.name}</p>
                  <p className="text-[11px] font-bold mt-1" style={{ color: '#666' }}>{profile.highlight}</p>
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  <span className="pa-tag text-[9px] px-2 py-1" style={{ color: COMPANY_COLORS[companyTier] }}>
                    {companyMeta.shortLabel} ×{profile.companyMultiplier}
                  </span>
                  <span className="pa-tag text-[9px] px-2 py-1">部门 ×{profile.deptMultiplier.toFixed(2)}</span>
                </div>
              </div>

              <p className="text-[10px] leading-relaxed mb-3 px-3 py-2 rounded-lg" style={{ background: COMPANY_COLORS[companyTier] + '14', color: '#555' }}>
                💡 {profile.companyContext}
              </p>

              {profile.variablePay && (
                <p className="text-[10px] font-bold mb-3 px-3 py-2 rounded-lg" style={{ background: dept.color + '12', color: dept.color }}>
                  ⚡ {profile.variablePay}
                </p>
              )}

              <div className="space-y-3">
                {profile.tiers.map((row) => {
                  const payMax = row.tier === 'intern' ? (row.dailyMax ?? 0) : row.monthlyMax;
                  const payRef = row.tier === 'intern' ? 800 : maxSalary;
                  const barW = Math.min(100, Math.round((payMax / payRef) * 100));
                  const color = TIER_BAR_COLORS[row.tier] ?? dept.color;
                  return (
                    <div key={row.tier} className="pa-panel p-3" style={{ borderColor: color + '44' }}>
                      <div className="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded" style={{ background: color + '22', color }}>
                            {row.tierLabel}
                          </span>
                          <span className="text-sm font-extrabold" style={{ color: dept.color }}>
                            {formatTierPay(row)}
                          </span>
                        </div>
                        <span className="text-[9px] font-bold text-right max-w-[48%]" style={{ color: '#999' }}>{row.bonus}</span>
                      </div>
                      <div className="h-2 rounded-full overflow-hidden mb-2" style={{ background: '#eee' }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${barW}%` }}
                          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                          className="h-full rounded-full"
                          style={{ background: `linear-gradient(90deg, ${color}99, ${color})` }}
                        />
                      </div>
                      <p className="text-[9px] leading-snug" style={{ color: '#888' }}>{row.note}</p>
                      <p className="text-[9px] font-bold mt-1" style={{ color: '#aaa' }}>
                        {estimateAnnualPackage(row, companyTier)}
                      </p>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          <div className="pa-panel p-4" style={{ borderColor: '#ddd' }}>
            <button
              type="button"
              onClick={() => setShowCompare((v) => !v)}
              className="w-full flex items-center justify-between text-left"
            >
              <p className="text-[11px] font-extrabold" style={{ color: '#444' }}>
                📊 同部门「专员」跨厂对比（一线）
              </p>
              <span className="text-xs">{showCompare ? '▲' : '▼'}</span>
            </button>
            {showCompare && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 space-y-2">
                {compareRows.map(({ company, range }) => (
                  <div key={company.id} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: COMPANY_COLORS[company.id] }} />
                      <span className="text-[10px] font-bold truncate" style={{ color: '#555' }}>{company.label}</span>
                    </div>
                    <span className="text-[11px] font-extrabold shrink-0" style={{ color: COMPANY_COLORS[company.id] }}>
                      {range} / 月
                    </span>
                  </div>
                ))}
                <p className="text-[8px] pt-1" style={{ color: '#bbb' }}>同部门、同职级、同城市下的梯队差异，便于感知跳档空间</p>
              </motion.div>
            )}
          </div>

          <div className="pa-panel p-4 space-y-3" style={{ borderColor: 'var(--pa-gold)' }}>
            <p className="text-[11px] font-extrabold" style={{ color: 'var(--pa-gold-dark)' }}>📌 梯队说明</p>
            <div className="space-y-1.5">
              {COMPANY_TIER_OPTIONS.map((c) => (
                <p key={c.id} className="text-[9px] leading-snug" style={{ color: '#777' }}>
                  <span className="font-extrabold" style={{ color: COMPANY_COLORS[c.id] }}>{c.label}</span>
                  {' '}— {c.hint}（如 {c.examples.split('、').slice(0, 2).join('、')}…）
                </p>
              ))}
            </div>
            <p className="text-[10px] leading-relaxed pt-1 border-t" style={{ borderColor: '#eee', color: '#666' }}>{SALARY_DISCLAIMER}</p>
          </div>
        </div>
      </div>
    </PABackground>
  );
}
