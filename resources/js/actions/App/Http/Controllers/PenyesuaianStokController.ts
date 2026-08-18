import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\PenyesuaianStokController::index
* @see app/Http/Controllers/PenyesuaianStokController.php:21
* @route '/penyesuaian-stok'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/penyesuaian-stok',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PenyesuaianStokController::index
* @see app/Http/Controllers/PenyesuaianStokController.php:21
* @route '/penyesuaian-stok'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PenyesuaianStokController::index
* @see app/Http/Controllers/PenyesuaianStokController.php:21
* @route '/penyesuaian-stok'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PenyesuaianStokController::index
* @see app/Http/Controllers/PenyesuaianStokController.php:21
* @route '/penyesuaian-stok'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PenyesuaianStokController::index
* @see app/Http/Controllers/PenyesuaianStokController.php:21
* @route '/penyesuaian-stok'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PenyesuaianStokController::index
* @see app/Http/Controllers/PenyesuaianStokController.php:21
* @route '/penyesuaian-stok'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PenyesuaianStokController::index
* @see app/Http/Controllers/PenyesuaianStokController.php:21
* @route '/penyesuaian-stok'
*/
indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

index.form = indexForm

/**
* @see \App\Http\Controllers\PenyesuaianStokController::create
* @see app/Http/Controllers/PenyesuaianStokController.php:85
* @route '/penyesuaian-stok/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/penyesuaian-stok/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PenyesuaianStokController::create
* @see app/Http/Controllers/PenyesuaianStokController.php:85
* @route '/penyesuaian-stok/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PenyesuaianStokController::create
* @see app/Http/Controllers/PenyesuaianStokController.php:85
* @route '/penyesuaian-stok/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PenyesuaianStokController::create
* @see app/Http/Controllers/PenyesuaianStokController.php:85
* @route '/penyesuaian-stok/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PenyesuaianStokController::create
* @see app/Http/Controllers/PenyesuaianStokController.php:85
* @route '/penyesuaian-stok/create'
*/
const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PenyesuaianStokController::create
* @see app/Http/Controllers/PenyesuaianStokController.php:85
* @route '/penyesuaian-stok/create'
*/
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PenyesuaianStokController::create
* @see app/Http/Controllers/PenyesuaianStokController.php:85
* @route '/penyesuaian-stok/create'
*/
createForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

create.form = createForm

/**
* @see \App\Http\Controllers\PenyesuaianStokController::print
* @see app/Http/Controllers/PenyesuaianStokController.php:842
* @route '/penyesuaian-stok/{adjustmentStock}/print'
*/
export const print = (args: { adjustmentStock: number | { id: number } } | [adjustmentStock: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: print.url(args, options),
    method: 'get',
})

print.definition = {
    methods: ["get","head"],
    url: '/penyesuaian-stok/{adjustmentStock}/print',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PenyesuaianStokController::print
* @see app/Http/Controllers/PenyesuaianStokController.php:842
* @route '/penyesuaian-stok/{adjustmentStock}/print'
*/
print.url = (args: { adjustmentStock: number | { id: number } } | [adjustmentStock: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { adjustmentStock: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { adjustmentStock: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            adjustmentStock: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        adjustmentStock: typeof args.adjustmentStock === 'object'
        ? args.adjustmentStock.id
        : args.adjustmentStock,
    }

    return print.definition.url
            .replace('{adjustmentStock}', parsedArgs.adjustmentStock.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PenyesuaianStokController::print
* @see app/Http/Controllers/PenyesuaianStokController.php:842
* @route '/penyesuaian-stok/{adjustmentStock}/print'
*/
print.get = (args: { adjustmentStock: number | { id: number } } | [adjustmentStock: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: print.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PenyesuaianStokController::print
* @see app/Http/Controllers/PenyesuaianStokController.php:842
* @route '/penyesuaian-stok/{adjustmentStock}/print'
*/
print.head = (args: { adjustmentStock: number | { id: number } } | [adjustmentStock: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: print.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PenyesuaianStokController::print
* @see app/Http/Controllers/PenyesuaianStokController.php:842
* @route '/penyesuaian-stok/{adjustmentStock}/print'
*/
const printForm = (args: { adjustmentStock: number | { id: number } } | [adjustmentStock: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: print.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PenyesuaianStokController::print
* @see app/Http/Controllers/PenyesuaianStokController.php:842
* @route '/penyesuaian-stok/{adjustmentStock}/print'
*/
printForm.get = (args: { adjustmentStock: number | { id: number } } | [adjustmentStock: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: print.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PenyesuaianStokController::print
* @see app/Http/Controllers/PenyesuaianStokController.php:842
* @route '/penyesuaian-stok/{adjustmentStock}/print'
*/
printForm.head = (args: { adjustmentStock: number | { id: number } } | [adjustmentStock: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: print.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

print.form = printForm

/**
* @see \App\Http\Controllers\PenyesuaianStokController::printSuratJalan
* @see app/Http/Controllers/PenyesuaianStokController.php:851
* @route '/penyesuaian-stok/{adjustmentStock}/print-surat-jalan'
*/
export const printSuratJalan = (args: { adjustmentStock: number | { id: number } } | [adjustmentStock: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: printSuratJalan.url(args, options),
    method: 'get',
})

printSuratJalan.definition = {
    methods: ["get","head"],
    url: '/penyesuaian-stok/{adjustmentStock}/print-surat-jalan',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PenyesuaianStokController::printSuratJalan
* @see app/Http/Controllers/PenyesuaianStokController.php:851
* @route '/penyesuaian-stok/{adjustmentStock}/print-surat-jalan'
*/
printSuratJalan.url = (args: { adjustmentStock: number | { id: number } } | [adjustmentStock: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { adjustmentStock: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { adjustmentStock: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            adjustmentStock: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        adjustmentStock: typeof args.adjustmentStock === 'object'
        ? args.adjustmentStock.id
        : args.adjustmentStock,
    }

    return printSuratJalan.definition.url
            .replace('{adjustmentStock}', parsedArgs.adjustmentStock.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PenyesuaianStokController::printSuratJalan
* @see app/Http/Controllers/PenyesuaianStokController.php:851
* @route '/penyesuaian-stok/{adjustmentStock}/print-surat-jalan'
*/
printSuratJalan.get = (args: { adjustmentStock: number | { id: number } } | [adjustmentStock: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: printSuratJalan.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PenyesuaianStokController::printSuratJalan
* @see app/Http/Controllers/PenyesuaianStokController.php:851
* @route '/penyesuaian-stok/{adjustmentStock}/print-surat-jalan'
*/
printSuratJalan.head = (args: { adjustmentStock: number | { id: number } } | [adjustmentStock: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: printSuratJalan.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PenyesuaianStokController::printSuratJalan
* @see app/Http/Controllers/PenyesuaianStokController.php:851
* @route '/penyesuaian-stok/{adjustmentStock}/print-surat-jalan'
*/
const printSuratJalanForm = (args: { adjustmentStock: number | { id: number } } | [adjustmentStock: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: printSuratJalan.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PenyesuaianStokController::printSuratJalan
* @see app/Http/Controllers/PenyesuaianStokController.php:851
* @route '/penyesuaian-stok/{adjustmentStock}/print-surat-jalan'
*/
printSuratJalanForm.get = (args: { adjustmentStock: number | { id: number } } | [adjustmentStock: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: printSuratJalan.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PenyesuaianStokController::printSuratJalan
* @see app/Http/Controllers/PenyesuaianStokController.php:851
* @route '/penyesuaian-stok/{adjustmentStock}/print-surat-jalan'
*/
printSuratJalanForm.head = (args: { adjustmentStock: number | { id: number } } | [adjustmentStock: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: printSuratJalan.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

printSuratJalan.form = printSuratJalanForm

/**
* @see \App\Http\Controllers\PenyesuaianStokController::store
* @see app/Http/Controllers/PenyesuaianStokController.php:111
* @route '/penyesuaian-stok'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/penyesuaian-stok',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PenyesuaianStokController::store
* @see app/Http/Controllers/PenyesuaianStokController.php:111
* @route '/penyesuaian-stok'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PenyesuaianStokController::store
* @see app/Http/Controllers/PenyesuaianStokController.php:111
* @route '/penyesuaian-stok'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PenyesuaianStokController::store
* @see app/Http/Controllers/PenyesuaianStokController.php:111
* @route '/penyesuaian-stok'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PenyesuaianStokController::store
* @see app/Http/Controllers/PenyesuaianStokController.php:111
* @route '/penyesuaian-stok'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\PenyesuaianStokController::edit
* @see app/Http/Controllers/PenyesuaianStokController.php:324
* @route '/penyesuaian-stok/{adjustmentStock}/edit'
*/
export const edit = (args: { adjustmentStock: number | { id: number } } | [adjustmentStock: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/penyesuaian-stok/{adjustmentStock}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PenyesuaianStokController::edit
* @see app/Http/Controllers/PenyesuaianStokController.php:324
* @route '/penyesuaian-stok/{adjustmentStock}/edit'
*/
edit.url = (args: { adjustmentStock: number | { id: number } } | [adjustmentStock: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { adjustmentStock: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { adjustmentStock: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            adjustmentStock: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        adjustmentStock: typeof args.adjustmentStock === 'object'
        ? args.adjustmentStock.id
        : args.adjustmentStock,
    }

    return edit.definition.url
            .replace('{adjustmentStock}', parsedArgs.adjustmentStock.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PenyesuaianStokController::edit
* @see app/Http/Controllers/PenyesuaianStokController.php:324
* @route '/penyesuaian-stok/{adjustmentStock}/edit'
*/
edit.get = (args: { adjustmentStock: number | { id: number } } | [adjustmentStock: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PenyesuaianStokController::edit
* @see app/Http/Controllers/PenyesuaianStokController.php:324
* @route '/penyesuaian-stok/{adjustmentStock}/edit'
*/
edit.head = (args: { adjustmentStock: number | { id: number } } | [adjustmentStock: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PenyesuaianStokController::edit
* @see app/Http/Controllers/PenyesuaianStokController.php:324
* @route '/penyesuaian-stok/{adjustmentStock}/edit'
*/
const editForm = (args: { adjustmentStock: number | { id: number } } | [adjustmentStock: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PenyesuaianStokController::edit
* @see app/Http/Controllers/PenyesuaianStokController.php:324
* @route '/penyesuaian-stok/{adjustmentStock}/edit'
*/
editForm.get = (args: { adjustmentStock: number | { id: number } } | [adjustmentStock: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PenyesuaianStokController::edit
* @see app/Http/Controllers/PenyesuaianStokController.php:324
* @route '/penyesuaian-stok/{adjustmentStock}/edit'
*/
editForm.head = (args: { adjustmentStock: number | { id: number } } | [adjustmentStock: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

edit.form = editForm

/**
* @see \App\Http\Controllers\PenyesuaianStokController::update
* @see app/Http/Controllers/PenyesuaianStokController.php:373
* @route '/penyesuaian-stok/{adjustmentStock}'
*/
export const update = (args: { adjustmentStock: string | number } | [adjustmentStock: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/penyesuaian-stok/{adjustmentStock}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\PenyesuaianStokController::update
* @see app/Http/Controllers/PenyesuaianStokController.php:373
* @route '/penyesuaian-stok/{adjustmentStock}'
*/
update.url = (args: { adjustmentStock: string | number } | [adjustmentStock: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { adjustmentStock: args }
    }

    if (Array.isArray(args)) {
        args = {
            adjustmentStock: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        adjustmentStock: args.adjustmentStock,
    }

    return update.definition.url
            .replace('{adjustmentStock}', parsedArgs.adjustmentStock.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PenyesuaianStokController::update
* @see app/Http/Controllers/PenyesuaianStokController.php:373
* @route '/penyesuaian-stok/{adjustmentStock}'
*/
update.put = (args: { adjustmentStock: string | number } | [adjustmentStock: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\PenyesuaianStokController::update
* @see app/Http/Controllers/PenyesuaianStokController.php:373
* @route '/penyesuaian-stok/{adjustmentStock}'
*/
const updateForm = (args: { adjustmentStock: string | number } | [adjustmentStock: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PenyesuaianStokController::update
* @see app/Http/Controllers/PenyesuaianStokController.php:373
* @route '/penyesuaian-stok/{adjustmentStock}'
*/
updateForm.put = (args: { adjustmentStock: string | number } | [adjustmentStock: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update.form = updateForm

/**
* @see \App\Http\Controllers\PenyesuaianStokController::destroy
* @see app/Http/Controllers/PenyesuaianStokController.php:578
* @route '/penyesuaian-stok/{adjustmentStock}'
*/
export const destroy = (args: { adjustmentStock: number | { id: number } } | [adjustmentStock: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/penyesuaian-stok/{adjustmentStock}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\PenyesuaianStokController::destroy
* @see app/Http/Controllers/PenyesuaianStokController.php:578
* @route '/penyesuaian-stok/{adjustmentStock}'
*/
destroy.url = (args: { adjustmentStock: number | { id: number } } | [adjustmentStock: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { adjustmentStock: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { adjustmentStock: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            adjustmentStock: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        adjustmentStock: typeof args.adjustmentStock === 'object'
        ? args.adjustmentStock.id
        : args.adjustmentStock,
    }

    return destroy.definition.url
            .replace('{adjustmentStock}', parsedArgs.adjustmentStock.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PenyesuaianStokController::destroy
* @see app/Http/Controllers/PenyesuaianStokController.php:578
* @route '/penyesuaian-stok/{adjustmentStock}'
*/
destroy.delete = (args: { adjustmentStock: number | { id: number } } | [adjustmentStock: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\PenyesuaianStokController::destroy
* @see app/Http/Controllers/PenyesuaianStokController.php:578
* @route '/penyesuaian-stok/{adjustmentStock}'
*/
const destroyForm = (args: { adjustmentStock: number | { id: number } } | [adjustmentStock: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PenyesuaianStokController::destroy
* @see app/Http/Controllers/PenyesuaianStokController.php:578
* @route '/penyesuaian-stok/{adjustmentStock}'
*/
destroyForm.delete = (args: { adjustmentStock: number | { id: number } } | [adjustmentStock: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

/**
* @see \App\Http\Controllers\PenyesuaianStokController::editInfo
* @see app/Http/Controllers/PenyesuaianStokController.php:613
* @route '/penyesuaian-stok/{adjustmentStock}/editinfo'
*/
export const editInfo = (args: { adjustmentStock: string | number } | [adjustmentStock: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: editInfo.url(args, options),
    method: 'put',
})

editInfo.definition = {
    methods: ["put"],
    url: '/penyesuaian-stok/{adjustmentStock}/editinfo',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\PenyesuaianStokController::editInfo
* @see app/Http/Controllers/PenyesuaianStokController.php:613
* @route '/penyesuaian-stok/{adjustmentStock}/editinfo'
*/
editInfo.url = (args: { adjustmentStock: string | number } | [adjustmentStock: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { adjustmentStock: args }
    }

    if (Array.isArray(args)) {
        args = {
            adjustmentStock: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        adjustmentStock: args.adjustmentStock,
    }

    return editInfo.definition.url
            .replace('{adjustmentStock}', parsedArgs.adjustmentStock.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PenyesuaianStokController::editInfo
* @see app/Http/Controllers/PenyesuaianStokController.php:613
* @route '/penyesuaian-stok/{adjustmentStock}/editinfo'
*/
editInfo.put = (args: { adjustmentStock: string | number } | [adjustmentStock: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: editInfo.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\PenyesuaianStokController::editInfo
* @see app/Http/Controllers/PenyesuaianStokController.php:613
* @route '/penyesuaian-stok/{adjustmentStock}/editinfo'
*/
const editInfoForm = (args: { adjustmentStock: string | number } | [adjustmentStock: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: editInfo.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PenyesuaianStokController::editInfo
* @see app/Http/Controllers/PenyesuaianStokController.php:613
* @route '/penyesuaian-stok/{adjustmentStock}/editinfo'
*/
editInfoForm.put = (args: { adjustmentStock: string | number } | [adjustmentStock: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: editInfo.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

editInfo.form = editInfoForm

/**
* @see \App\Http\Controllers\PenyesuaianStokController::getTransferToken
* @see app/Http/Controllers/PenyesuaianStokController.php:288
* @route '/penyesuaian-stok/transfer-token/{token}'
*/
export const getTransferToken = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getTransferToken.url(args, options),
    method: 'get',
})

getTransferToken.definition = {
    methods: ["get","head"],
    url: '/penyesuaian-stok/transfer-token/{token}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PenyesuaianStokController::getTransferToken
* @see app/Http/Controllers/PenyesuaianStokController.php:288
* @route '/penyesuaian-stok/transfer-token/{token}'
*/
getTransferToken.url = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { token: args }
    }

    if (Array.isArray(args)) {
        args = {
            token: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        token: args.token,
    }

    return getTransferToken.definition.url
            .replace('{token}', parsedArgs.token.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PenyesuaianStokController::getTransferToken
* @see app/Http/Controllers/PenyesuaianStokController.php:288
* @route '/penyesuaian-stok/transfer-token/{token}'
*/
getTransferToken.get = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getTransferToken.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PenyesuaianStokController::getTransferToken
* @see app/Http/Controllers/PenyesuaianStokController.php:288
* @route '/penyesuaian-stok/transfer-token/{token}'
*/
getTransferToken.head = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getTransferToken.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PenyesuaianStokController::getTransferToken
* @see app/Http/Controllers/PenyesuaianStokController.php:288
* @route '/penyesuaian-stok/transfer-token/{token}'
*/
const getTransferTokenForm = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getTransferToken.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PenyesuaianStokController::getTransferToken
* @see app/Http/Controllers/PenyesuaianStokController.php:288
* @route '/penyesuaian-stok/transfer-token/{token}'
*/
getTransferTokenForm.get = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getTransferToken.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PenyesuaianStokController::getTransferToken
* @see app/Http/Controllers/PenyesuaianStokController.php:288
* @route '/penyesuaian-stok/transfer-token/{token}'
*/
getTransferTokenForm.head = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getTransferToken.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

getTransferToken.form = getTransferTokenForm

const PenyesuaianStokController = { index, create, print, printSuratJalan, store, edit, update, destroy, editInfo, getTransferToken }

export default PenyesuaianStokController