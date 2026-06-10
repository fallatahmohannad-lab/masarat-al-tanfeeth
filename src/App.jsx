import { useEffect } from 'react'
import { useApp } from './context/AppStateContext.jsx'
import TopBar from './components/common/TopBar.jsx'
import Stepper from './components/common/Stepper.jsx'

import OnboardingContainer from './components/steps/OnboardingContainer.jsx'
import ContractorDashboard from './components/steps/ContractorDashboard.jsx'
import Step1Matching from './components/steps/Step1Matching.jsx'
import Step2StudyAward from './components/steps/Step2StudyAward.jsx'
import Step3ClaimValidation from './components/steps/Step3ClaimValidation.jsx'
import Step4SmartAudit from './components/steps/Step4SmartAudit.jsx'
import Step5Financier from './components/steps/Step5Financier.jsx'

const STEP_VIEWS = {
  1: Step1Matching,
  2: Step2StudyAward,
  3: Step3ClaimValidation,
  4: Step4SmartAudit,
  5: Step5Financier,
}

export default function App() {
  const { state, dir, lang } = useApp()

  // Keep <html dir/lang> in sync so Arabic renders RTL and English LTR.
  useEffect(() => {
    document.documentElement.dir = dir
    document.documentElement.lang = lang
  }, [dir, lang])

  // Gate everything behind institutional onboarding / login.
  if (!state.isAuthenticated) return <OnboardingContainer />

  const isHome = state.view === 'home'
  const View = STEP_VIEWS[state.step] || Step1Matching

  return (
    <div className="min-h-screen bg-page">
      <TopBar />
      {!isHome && <Stepper />}
      <main className="mx-auto max-w-[1280px] px-4 py-6 sm:py-8">
        {isHome ? <ContractorDashboard /> : <View />}
      </main>
    </div>
  )
}
