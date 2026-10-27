# Markov: valores propios y convergencia (NumWorks/MicroPython)
# Las filas representan el estado actual.
from math import log, pi, cos, sin


def identidad(n):
    return [[1.0 if i == j else 0.0 for j in range(n)]
            for i in range(n)]


def producto(A, B):
    n = len(A)
    C = [[0.0] * n for _ in range(n)]
    for i in range(n):
        for k in range(n):
            a = A[i][k]
            for j in range(n):
                C[i][j] += a * B[k][j]
    return C


def potencia(A, n):
    R = identidad(len(A))
    B = [fila[:] for fila in A]
    while n > 0:
        if n % 2:
            R = producto(R, B)
        n //= 2
        if n:
            B = producto(B, B)
    return R


def diferencia_filas(A):
    n = len(A)
    return max(max(A[i][j] for i in range(n)) -
               min(A[i][j] for i in range(n))
               for j in range(n))


def primer_paso(A, eps, limite=100000):
    # Busqueda exponencial y binaria; no prueba n=1,2,3,...
    izq, der = 0, 1
    while diferencia_filas(potencia(A, der)) > eps:
        izq = der
        der *= 2
        if der > limite:
            return None
    while der - izq > 1:
        m = (izq + der) // 2
        if diferencia_filas(potencia(A, m)) <= eps:
            der = m
        else:
            izq = m
    return der


def polinomio_caracteristico(A):
    # Faddeev-LeVerrier. coeficientes de mayor a menor grado
    n = len(A)
    B = identidad(n)
    c = [1.0]
    for k in range(1, n + 1):
        B = producto(A, B)
        ck = -sum(B[i][i] for i in range(n)) / k
        c.append(ck)
        for i in range(n):
            B[i][i] += ck
    return c


def eval_poli_y_derivada(c, z):
    p = complex(c[0])
    dp = 0j
    for a in c[1:]:
        dp = dp * z + p
        p = p * z + a
    return p, dp


def raices_aberth(c):
    # Aberth-Ehrlich, admite raices complejas; n pequeno
    m = len(c) - 1
    if m == 0:
        return []
    if m == 1:
        return [-complex(c[1]) / c[0]]
    r = [0.85 * complex(cos(2*pi*(k+0.17)/m),
                        sin(2*pi*(k+0.17)/m)) for k in range(m)]
    for it in range(250):
        cambios = 0.0
        for k in range(m):
            z = r[k]
            p, dp = eval_poli_y_derivada(c, z)
            if abs(p) < 1e-14:
                continue
            s = 0j
            for j in range(m):
                if j != k:
                    d = z - r[j]
                    if abs(d) > 1e-14:
                        s += 1 / d
            denom = dp - p*s
            if abs(denom) < 1e-15:
                continue
            delta = p / denom
            r[k] -= delta
            cambios = max(cambios, abs(delta))
        if cambios < 1e-12:
            break
    return r


def valores_propios(P):
    # Por ser estocastica por filas, lambda=1 es valor propio exacto.
    c = polinomio_caracteristico(P)
    # Division sintetica del polinomio por (lambda - 1).
    q = [c[0]]
    for a in c[1:-1]:
        q.append(a + q[-1])
    otros = raices_aberth(q)
    max_residuo = max([abs(eval_poli_y_derivada(q, z)[0])
                       for z in otros] or [0.0])
    return [1.0+0j] + otros, max_residuo


def pedir_entero(mensaje, minimo, maximo):
    while True:
        try:
            v = int(input(mensaje))
            if minimo <= v <= maximo:
                return v
        except ValueError:
            pass
        print('Introduce un entero entre', minimo, 'y', maximo)


def pedir_real(mensaje):
    while True:
        try:
            return float(input(mensaje))
        except ValueError:
            print('Numero no valido. Intenta de nuevo.')


def leer_matriz(n):
    P = []
    print('\nIntroduce las probabilidades entre 0 y 1.')
    print('Cada fila debe sumar 1.')
    for i in range(n):
        while True:
            fila = []
            print('\nFila', i + 1)
            for j in range(n):
                while True:
                    x = pedir_real('x{}{}: '.format(i+1, j+1))
                    if 0 <= x <= 1:
                        fila.append(x)
                        break
                    print('El valor debe estar entre 0 y 1.')
            total = sum(fila)
            if abs(total - 1.0) <= 1e-8:
                P.append(fila)
                break
            print('La fila suma', round(total, 8), 'y debe sumar 1.')
            print('Vuelve a introducir esta fila.')
    return P


def mostrar_lambda(z):
    if abs(z.imag) < 1e-9:
        return '{:.7f}'.format(z.real)
    signo = '+' if z.imag >= 0 else '-'
    return '{:.7f} {} {:.7f}i'.format(z.real, signo, abs(z.imag))


def ejecutar():
    print('CADENAS DE MARKOV - NUMWORKS')
    print('Valores propios y convergencia')
    print('Tamano recomendado: 2 a 6')
    n = pedir_entero('Tamano n (2-6): ', 2, 6)
    P = leer_matriz(n)
    eps = pedir_real('\nTolerancia (ej. 0.000001): ')
    while not 0 < eps < 1:
        print('La tolerancia debe estar entre 0 y 1.')
        eps = pedir_real('Tolerancia: ')

    vals, residuo = valores_propios(P)
    vals.sort(key=lambda z: abs(z), reverse=True)
    print('\nVALORES PROPIOS:')
    for i,z in enumerate(vals):
        print('L{} = {}'.format(i+1, mostrar_lambda(z)))
    rho = abs(vals[1])
    print('\n|L2| = {:.7f}'.format(rho))
    if residuo > 1e-7:
        print('AVISO: raices poco precisas (residuo elevado).')

    if rho < 1e-15:
        print('Estimacion por lambda: no aplicable (|L2|=0).')
    elif rho < 1:
        est = log(eps) / log(rho)
        print('n espectral aprox. = {:.3f}'.format(est))
    else:
        print('No hay convergencia garantizada por autovalores.')

    nmin = primer_paso(P, eps)
    if nmin is None:
        print('No se verifico la tolerancia hasta 100000 pasos.')
        return
    print('\nPRIMER PASO QUE CUMPLE TOLERANCIA:')
    print('n =', nmin)
    print('Se verifica con P^{}'.format(nmin))
    print('Diferencia entre filas: {:.3e}'.format(
        diferencia_filas(potencia(P, nmin))))
    if nmin > 1:
        print('En P^{}: {:.3e}'.format(nmin-1,
              diferencia_filas(potencia(P, nmin-1))))
    print('\nFilas de P^{} (aproximadas):'.format(nmin))
    for fila in potencia(P, nmin):
        print(' '.join('{:.6f}'.format(x) for x in fila))


ejecutar()
