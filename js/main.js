/* ============================================================
   Caroneiros — Main Application Script
   ============================================================ */

;(function () {
  'use strict'

  /* ----- DOM References ----- */
  const header = document.getElementById('header')
  const menuToggle = document.getElementById('menuToggle')
  const mainNav = document.getElementById('mainNav')
  const navLinks = document.querySelectorAll('[data-section]')
  const revealElements = document.querySelectorAll('[data-reveal]')
  const shareNative = document.getElementById('shareNative')
  const copyBtn = document.getElementById('copyLink')
  const shareLinkInput = document.getElementById('shareLink')
  const toast = document.getElementById('toast')
  const yearSpan = document.getElementById('currentYear')
  const statNumbers = document.querySelectorAll('[data-count]')

  let APP_URL = shareLinkInput ? shareLinkInput.value : 'https://caroneiros.online'
  const APP_NAME = 'Caroneiros'
  let SHARE_TEXT = `Baixe o ${APP_NAME} e encontre caronas perto de você! ${APP_URL}`

  /* ============================================================
     Auth System
     ============================================================ */
  const AUTH_KEY = 'caroneiros_user'
  const BONUS_KEY = 'caroneiros_bonus'

  const authBtn = document.getElementById('authBtn')
  const authBtnText = document.getElementById('authBtnText')
  const authModal = document.getElementById('authModal')
  const authOverlay = document.getElementById('authOverlay')
  const authClose = document.getElementById('authClose')
  const authTabLogin = document.getElementById('authTabLogin')
  const authTabSignup = document.getElementById('authTabSignup')
  const authModalTitle = document.getElementById('authModalTitle')
  const authModalDesc = document.getElementById('authModalDesc')
  const authGoogle = document.getElementById('authGoogle')
  const authForm = document.getElementById('authForm')
  const authNameField = document.getElementById('authNameField')
  const authName = document.getElementById('authName')
  const authEmail = document.getElementById('authEmail')
  const authPassword = document.getElementById('authPassword')
  const authSubmit = document.getElementById('authSubmit')
  const authSubmitText = document.getElementById('authSubmitText')

  let currentAuthTab = 'signup'

  function getStoredUser () {
    try {
      const raw = localStorage.getItem(AUTH_KEY)
      return raw ? JSON.parse(raw) : null
    } catch { return null }
  }

  function getStoredBonus () {
    try {
      const raw = localStorage.getItem(BONUS_KEY)
      return raw ? JSON.parse(raw) : 0
    } catch { return 0 }
  }

  function setStoredBonus (points) {
    localStorage.setItem(BONUS_KEY, JSON.stringify(points))
  }

  function addBonus (points) {
    const current = getStoredBonus()
    const updated = current + points
    setStoredBonus(updated)
    return updated
  }

  function saveUser (user) {
    localStorage.setItem(AUTH_KEY, JSON.stringify(user))
    addBonus(50)
    updateAuthUI()
  }

  function logoutUser () {
    localStorage.removeItem(AUTH_KEY)
    updateAuthUI()
  }

  function updateAuthUI () {
    updateNavAuthBtn()
    const user = getStoredUser()

    if (shareLinkInput) {
      shareLinkInput.value = user 
        ? `https://caroneiros.online/invite/${user.id}` 
        : 'https://caroneiros.online'
    }
    APP_URL = shareLinkInput ? shareLinkInput.value : 'https://caroneiros.online'
    SHARE_TEXT = `Baixe o ${APP_NAME} e encontre caronas perto de você! ${APP_URL}`

    if (!authBtn) return

    if (user) {
      const initial = (user.name || user.email || 'U').charAt(0).toUpperCase()
      const bonus = getStoredBonus()
      authBtn.innerHTML = `
        <div class="header__user-avatar">${initial}</div>
        <span class="header__user-name">${user.name || user.email}</span>
        <span class="header__user-badge">${bonus}pts</span>
      `
      authBtn.className = 'header__user'
      authBtn.title = 'Você está logado. Clique para sair.'
      authBtn.removeEventListener('click', openAuthModal)
      authBtn.addEventListener('click', function onUserClick () {
        if (confirm('Deseja sair da sua conta?')) {
          logoutUser()
          showToast('Você saiu da sua conta.')
        }
      })
    } else {
      authBtn.className = 'btn btn--outline btn--sm header__auth'
      authBtn.title = ''
      authBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        <span>Entrar</span>
      `
      authBtn.removeEventListener('click', onUserClick)
      authBtn.addEventListener('click', openAuthModal)
    }
  }

  /* ----- Modal ----- */
  function openAuthModal (tab) {
    if (!authModal) return
    currentAuthTab = tab || 'signup'
    updateModalTabs()
    authModal.classList.add('modal--open')
    authModal.setAttribute('aria-hidden', 'false')
    document.body.classList.add('modal-open')
    authEmail.focus()
  }

  function closeAuthModal () {
    if (!authModal) return
    authModal.classList.remove('modal--open')
    authModal.setAttribute('aria-hidden', 'true')
    document.body.classList.remove('modal-open')
    authForm.reset()
    authNameField.style.display = currentAuthTab === 'signup' ? 'block' : 'none'
  }

  function updateModalTabs () {
    const isLogin = currentAuthTab === 'login'
    authTabLogin.classList.toggle('modal__tab--active', isLogin)
    authTabLogin.setAttribute('aria-selected', isLogin)
    authTabSignup.classList.toggle('modal__tab--active', !isLogin)
    authTabSignup.setAttribute('aria-selected', !isLogin)

    authModalTitle.textContent = isLogin ? 'Entrar' : 'Criar Conta'
    authModalDesc.textContent = isLogin
      ? 'Entre com sua conta para continuar acumulando bônus.'
      : 'Crie sua conta para acumular bônus e usar o Caroneiros no celular.'
    authSubmitText.textContent = isLogin ? 'Entrar' : 'Criar Conta'

    authNameField.style.display = isLogin ? 'none' : 'block'
    authName.required = !isLogin
    authPassword.autocomplete = isLogin ? 'current-password' : 'new-password'
    authPassword.placeholder = isLogin ? 'Sua senha' : 'Mínimo 6 caracteres'
  }

  if (authTabLogin) {
    authTabLogin.addEventListener('click', function () {
      currentAuthTab = 'login'
      updateModalTabs()
    })
  }

  if (authTabSignup) {
    authTabSignup.addEventListener('click', function () {
      currentAuthTab = 'signup'
      updateModalTabs()
    })
  }

  if (authBtn) {
    authBtn.addEventListener('click', openAuthModal)
  }

  if (authOverlay) {
    authOverlay.addEventListener('click', closeAuthModal)
  }

  if (authClose) {
    authClose.addEventListener('click', closeAuthModal)
  }

  /* ----- Google Auth ----- */
  if (authGoogle) {
    authGoogle.addEventListener('click', function () {
      const isLogin = currentAuthTab === 'login'
      const mockUser = {
        id: 'google_' + Date.now(),
        name: 'Usuário Google',
        email: 'usuario' + Date.now().toString().slice(-4) + '@gmail.com',
        provider: 'google',
        createdAt: new Date().toISOString()
      }
      saveUser(mockUser)
      closeAuthModal()
      showToast(isLogin ? 'Login com Google realizado!' : 'Conta criada com Google!')
      if (!isLogin) {
        showToast('Conta criada! Você ganhou 50 pontos de bônus!')
      }
    })
  }

  /* ----- Email Auth ----- */
  if (authForm) {
    authForm.addEventListener('submit', function (e) {
      e.preventDefault()
      const isLogin = currentAuthTab === 'login'

      const email = authEmail.value.trim()
      const password = authPassword.value
      const name = authName.value.trim()

      if (!email) {
        showToast('Informe seu e-mail.')
        authEmail.focus()
        return
      }

      if (!password || password.length < 6) {
        showToast('A senha deve ter no mínimo 6 caracteres.')
        authPassword.focus()
        return
      }

      if (!isLogin && !name) {
        showToast('Informe seu nome.')
        authName.focus()
        return
      }

      if (isLogin) {
        const stored = getStoredUser()
        if (stored && stored.email === email) {
          saveUser({ ...stored, lastLogin: new Date().toISOString() })
          closeAuthModal()
          showToast('Bem-vindo de volta, ' + (stored.name || stored.email) + '!')
        } else {
          const newUser = {
            id: 'email_' + Date.now(),
            name: name || email.split('@')[0],
            email: email,
            provider: 'email',
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString()
          }
          saveUser(newUser)
          closeAuthModal()
          showToast('Login realizado!')
        }
      } else {
        const user = {
          id: 'email_' + Date.now(),
          name: name,
          email: email,
          provider: 'email',
          createdAt: new Date().toISOString()
        }
        saveUser(user)
        closeAuthModal()
        showToast('Conta criada! Você ganhou 50 pontos de bônus!')
      }
    })
  }

  /* ----- Keyboard: close modal on Escape ----- */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && authModal && authModal.classList.contains('modal--open')) {
      closeAuthModal()
    }
  })

  /* ----- Initialize Auth UI ----- */
  updateAuthUI()

  /* ----- Mobile Nav Auth Button ----- */
  const navAuthBtn = document.getElementById('navAuthBtn')

  if (navAuthBtn) {
    navAuthBtn.addEventListener('click', function () {
      if (getStoredUser()) {
        if (confirm('Deseja sair da sua conta?')) {
          logoutUser()
          showToast('Você saiu da sua conta.')
        }
      } else {
        openAuthModal('signup')
      }

      if (mainNav) mainNav.classList.remove('header__nav--open')
      if (menuToggle) {
        menuToggle.setAttribute('aria-expanded', 'false')
        menuToggle.setAttribute('aria-label', 'Abrir menu')
      }
      document.body.style.overflow = ''
    })
  }

  function updateNavAuthBtn () {
    if (!navAuthBtn) return
    const user = getStoredUser()
    navAuthBtn.textContent = user ? ('Sair (' + (user.name || user.email) + ')') : 'Criar Conta'
  }

  /* ============================================================
     End Auth System
     ============================================================ */

  /* ----- Toast System ----- */
  function showToast (message) {
    if (!toast) return
    toast.textContent = message
    toast.classList.add('toast--visible')
    clearTimeout(toast._hideTimer)
    toast._hideTimer = setTimeout(() => {
      toast.classList.remove('toast--visible')
    }, 2800)
  }

  /* ----- Copy Link ----- */
  if (copyBtn && shareLinkInput) {
    copyBtn.addEventListener('click', async function () {
      try {
        await navigator.clipboard.writeText(shareLinkInput.value)
        showToast('Link copiado!')
      } catch (_err) {
        shareLinkInput.select()
        document.execCommand('copy')
        showToast('Link copiado!')
      }
    })
  }

  /* ----- Generate Referral Link ----- */
  const generateLinkBtn = document.getElementById('generateLink')
  if (generateLinkBtn && shareLinkInput) {
    generateLinkBtn.addEventListener('click', function () {
      const user = getStoredUser()
      if (user) {
        shareLinkInput.value = `https://caroneiros.online/invite/${user.id}`
        APP_URL = shareLinkInput.value
        SHARE_TEXT = `Baixe o ${APP_NAME} e encontre caronas perto de você! ${APP_URL}`
        showToast('Link de indicação gerado!')
      } else {
        showToast('Faça login para gerar um link de convite e ganhar bônus!')
        openAuthModal('signup')
      }
    })
  }

  /* ----- Header scroll effect ----- */
  function handleHeaderScroll () {
    if (!header) return
    header.classList.toggle('header--scrolled', window.scrollY > 20)
  }

  window.addEventListener('scroll', handleHeaderScroll, { passive: true })
  handleHeaderScroll()

  /* ----- Mobile Menu ----- */
  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', function () {
      const isOpen = mainNav.classList.toggle('header__nav--open')
      menuToggle.setAttribute('aria-expanded', isOpen)
      menuToggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu')
      document.body.style.overflow = isOpen ? 'hidden' : ''
    })

    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        mainNav.classList.remove('header__nav--open')
        menuToggle.setAttribute('aria-expanded', 'false')
        menuToggle.setAttribute('aria-label', 'Abrir menu')
        document.body.style.overflow = ''
      })
    })

    document.addEventListener('click', function (e) {
      if (
        mainNav.classList.contains('header__nav--open') &&
        !mainNav.contains(e.target) &&
        !menuToggle.contains(e.target)
      ) {
        mainNav.classList.remove('header__nav--open')
        menuToggle.setAttribute('aria-expanded', 'false')
        menuToggle.setAttribute('aria-label', 'Abrir menu')
        document.body.style.overflow = ''
      }
    })
  }

  /* ----- Active Nav Link (Scroll Spy) ----- */
  function updateActiveNav () {
    const scrollY = window.scrollY + 120
    const sections = document.querySelectorAll('section[id]')

    let currentId = ''
    sections.forEach(function (section) {
      const top = section.offsetTop
      const height = section.offsetHeight
      if (scrollY >= top && scrollY < top + height) {
        currentId = section.id
      }
    })

    navLinks.forEach(function (link) {
      const href = link.getAttribute('href')
      if (href === '#' + currentId) {
        link.classList.add('header__nav-link--active')
      } else {
        link.classList.remove('header__nav-link--active')
      }
    })
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true })
  updateActiveNav()

  /* ----- Smooth Scroll for Nav Links ----- */
  navLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      const href = link.getAttribute('href')
      if (href && href.startsWith('#')) {
        e.preventDefault()
        const target = document.querySelector(href)
        if (target) {
          const headerHeight = header ? header.offsetHeight : 72
          const targetTop = target.getBoundingClientRect().top + window.scrollY - headerHeight
          window.scrollTo({ top: targetTop, behavior: 'smooth' })
        }
      }
    })
  })

  /* ----- Reveal Animations (Intersection Observer) ----- */
  if ('IntersectionObserver' in window && revealElements.length > 0) {
    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed')
            revealObserver.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    )

    revealElements.forEach(function (el) {
      revealObserver.observe(el)
    })
  } else {
    revealElements.forEach(function (el) {
      el.classList.add('revealed')
    })
  }

  /* ----- Animated Counter (Hero Stats) ----- */
  function animateCounters () {
    statNumbers.forEach(function (el) {
      const target = parseFloat(el.getAttribute('data-count'))
      const isDecimal = target % 1 !== 0
      const duration = 1800
      const startTime = performance.now()

      function update (currentTime) {
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        const current = eased * target

        el.textContent = isDecimal ? current.toFixed(1) : Math.floor(current).toLocaleString('pt-BR')

        if (progress < 1) {
          requestAnimationFrame(update)
        } else {
          el.textContent = isDecimal ? target.toFixed(1) : target.toLocaleString('pt-BR')
        }
      }

      requestAnimationFrame(update)
    })
  }

  if (statNumbers.length > 0) {
    const heroSection = document.getElementById('hero')
    if (heroSection) {
      if ('IntersectionObserver' in window) {
        const heroObserver = new IntersectionObserver(
          function (entries) {
            entries.forEach(function (entry) {
              if (entry.isIntersecting) {
                animateCounters()
                heroObserver.unobserve(entry.target)
              }
            })
          },
          { threshold: 0.3 }
        )
        heroObserver.observe(heroSection)
      } else {
        animateCounters()
      }
    }
  }

  /* ----- Native Share ----- */
  if (shareNative) {
    shareNative.addEventListener('click', async function () {
      if (navigator.share) {
        try {
          await navigator.share({
            title: APP_NAME,
            text: SHARE_TEXT,
            url: APP_URL
          })
        } catch (err) {
          if (err.name !== 'AbortError') {
            showToast('Não foi possível compartilhar.')
          }
        }
      } else {
        showToast('Seu navegador não suporta compartilhamento nativo. Use os links abaixo.')
      }
    })
  }

  /* ----- Social Share Links ----- */
  function getSocialUrl (platform) {
    const encodedUrl = encodeURIComponent(APP_URL)
    const encodedText = encodeURIComponent(SHARE_TEXT)

    const urls = {
      whatsapp: `https://wa.me/?text=${encodedText}`,
      telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodeURIComponent(`Baixe o ${APP_NAME} e encontre caronas perto de você!`)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodedText}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodeURIComponent(`Baixe o ${APP_NAME} e encontre caronas perto de você!`)}`
    }

    return urls[platform] || '#'
  }

  document.querySelectorAll('.share__social-link').forEach(function (link) {
    link.addEventListener('click', function (e) {
      const id = link.id
      const platformMap = {
        shareWhatsapp: 'whatsapp',
        shareTelegram: 'telegram',
        shareTwitter: 'twitter',
        shareFacebook: 'facebook'
      }
      const platform = platformMap[id]
      if (platform) {
        e.preventDefault()
        const url = getSocialUrl(platform)
        window.open(url, '_blank', 'noopener,noreferrer,width=600,height=500')
      }
    })
  })

  /* ----- Footer Year ----- */
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear()
  }

  /* ----- Keyboard Nav ----- */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (authModal && authModal.classList.contains('modal--open')) {
        closeAuthModal()
        return
      }
      if (appleStoreModal && appleStoreModal.classList.contains('modal--open')) {
        closeAppleModal()
        return
      }
      if (mainNav && mainNav.classList.contains('header__nav--open')) {
        mainNav.classList.remove('header__nav--open')
        if (menuToggle) {
          menuToggle.setAttribute('aria-expanded', 'false')
          menuToggle.setAttribute('aria-label', 'Abrir menu')
        }
        document.body.style.overflow = ''
        if (menuToggle) menuToggle.focus()
      }
    }
  })

  /* ----- App Stores download tracking ----- */
  document.querySelectorAll('.btn--store').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const store = btn.id === 'googlePlayBtn' ? 'google_play' : 'app_store'
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'download_click', { store: store, app: APP_NAME })
      }
    })
  })

  /* ----- Apple Store Modal Control ----- */
  const appleStoreBtn = document.getElementById('appleStoreBtn')
  const appleStoreModal = document.getElementById('appleStoreModal')
  const appleOverlay = document.getElementById('appleOverlay')
  const appleClose = document.getElementById('appleClose')
  const appleModalOk = document.getElementById('appleModalOk')

  function openAppleModal (e) {
    if (e) e.preventDefault()
    if (!appleStoreModal) return
    appleStoreModal.classList.add('modal--open')
    appleStoreModal.setAttribute('aria-hidden', 'false')
    document.body.classList.add('modal-open')
  }

  function closeAppleModal () {
    if (!appleStoreModal) return
    appleStoreModal.classList.remove('modal--open')
    appleStoreModal.setAttribute('aria-hidden', 'true')
    document.body.classList.remove('modal-open')
  }

  if (appleStoreBtn) {
    appleStoreBtn.addEventListener('click', openAppleModal)
  }
  if (appleOverlay) {
    appleOverlay.addEventListener('click', closeAppleModal)
  }
  if (appleClose) {
    appleClose.addEventListener('click', closeAppleModal)
  }
  if (appleModalOk) {
    appleModalOk.addEventListener('click', closeAppleModal)
  }

})()
