import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useApp } from '../../context/AppStateContext.jsx'

// Back / Next footer that walks the 5 steps. Arrows flip with reading direction.
export default function StepNav({ nextLabel, nextDisabled, onNext, hideNext }) {
  const { state, dir, tx, next, prev } = useApp()
  const Forward = dir === 'rtl' ? ArrowLeft : ArrowRight
  const Back = dir === 'rtl' ? ArrowRight : ArrowLeft

  return (
    <div className="mt-8 flex items-center justify-between border-t border-line pt-5">
      <button className="btn-outline" onClick={prev} disabled={state.step === 1}>
        <Back className="h-4 w-4" />
        {tx({ ar: 'السابق', en: 'Back' })}
      </button>
      {!hideNext && (
        <button
          className="btn-primary"
          disabled={nextDisabled || state.step === 5}
          onClick={() => {
            onNext?.()
            next()
          }}
        >
          {nextLabel || tx({ ar: 'التالي', en: 'Next' })}
          <Forward className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
